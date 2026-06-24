import react from '@vitejs/plugin-react-swc'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

const GITHUB_OAUTH_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const OAUTH_TOKEN_PROXY_PATH = '/login/oauth/access_token'
const OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS = 10_000

type OAuthTokenExchangeRequest = {
  code?: string
}

type OAuthTokenExchangeEnvironment = {
  VITE_CLIENT_ID?: string
  VITE_CLIENT_SECRET?: string
}

type MiddlewareStack =
  | ViteDevServer['middlewares']
  | PreviewServer['middlewares']

/**
 * Reads a JSON request body from Vite's Node middleware pipeline.
 * @param request - Incoming HTTP request sent by the browser callback route.
 * @returns Raw request body string.
 * @example
 * await readRequestBody(request)
 */
function readRequestBody(request: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = ''
    request.setEncoding('utf8')
    request.on('data', (chunk: string) => {
      body += chunk
    })
    request.on('end', () => resolve(body))
    request.on('error', reject)
  })
}

/**
 * Writes a JSON response from the local OAuth exchange middleware.
 * @param response - HTTP response object to complete.
 * @param statusCode - HTTP status returned to the browser.
 * @param body - JSON-serializable response payload.
 * @returns Nothing.
 * @example
 * sendJsonResponse(response, 400, { error: 'missing_code' })
 */
function sendJsonResponse(
  response: ServerResponse,
  statusCode: number,
  body: unknown,
) {
  response.statusCode = statusCode
  response.setHeader('Content-Type', 'application/json')
  response.end(JSON.stringify(body))
}

/**
 * Exchanges an OAuth code with GitHub while keeping the client secret on the dev server.
 * @param requestBody - Parsed browser request body containing the authorization code.
 * @param environment - Vite-loaded environment values for the GitHub OAuth app.
 * @returns GitHub's token exchange response.
 * @example
 * await exchangeGitHubOAuthCode({ code: 'abc' }, env)
 */
async function exchangeGitHubOAuthCode(
  requestBody: OAuthTokenExchangeRequest,
  environment: OAuthTokenExchangeEnvironment,
) {
  if (!requestBody.code) {
    return {
      body: { error: 'missing_code' },
      contentType: 'application/json',
      statusCode: 400,
    }
  }

  if (!environment.VITE_CLIENT_ID || !environment.VITE_CLIENT_SECRET) {
    return {
      body: { error: 'oauth_server_not_configured' },
      contentType: 'application/json',
      statusCode: 500,
    }
  }

  const abortController = new AbortController()
  const timeout = setTimeout(
    () => abortController.abort(),
    OAUTH_TOKEN_EXCHANGE_TIMEOUT_MS,
  )

  try {
    const githubResponse = await fetch(GITHUB_OAUTH_TOKEN_URL, {
      body: JSON.stringify({
        client_id: environment.VITE_CLIENT_ID,
        client_secret: environment.VITE_CLIENT_SECRET,
        code: requestBody.code,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      signal: abortController.signal,
    })
    const responseText = await githubResponse.text()

    return {
      body: responseText,
      contentType:
        githubResponse.headers.get('content-type') || 'application/json',
      statusCode: githubResponse.status,
    }
  } finally {
    clearTimeout(timeout)
  }
}

/**
 * Installs the same-origin OAuth token endpoint for local dev and preview servers.
 * @param middlewares - Vite middleware stack receiving browser requests.
 * @param environment - Vite-loaded environment values for the GitHub OAuth app.
 * @returns Nothing.
 * @example
 * installOAuthTokenExchangeMiddleware(server.middlewares, env)
 */
function installOAuthTokenExchangeMiddleware(
  middlewares: MiddlewareStack,
  environment: OAuthTokenExchangeEnvironment,
) {
  middlewares.use(async (request, response, next) => {
    if (
      request.method !== 'POST' ||
      request.url?.split('?')[0] !== OAUTH_TOKEN_PROXY_PATH
    ) {
      next()
      return
    }

    try {
      const rawBody = await readRequestBody(request)
      const parsedBody = JSON.parse(
        rawBody || '{}',
      ) as OAuthTokenExchangeRequest
      const exchangeResponse = await exchangeGitHubOAuthCode(
        parsedBody,
        environment,
      )

      response.statusCode = exchangeResponse.statusCode
      response.setHeader('Content-Type', exchangeResponse.contentType)
      if (typeof exchangeResponse.body === 'string') {
        response.end(exchangeResponse.body)
        return
      }

      response.end(JSON.stringify(exchangeResponse.body))
    } catch {
      sendJsonResponse(response, 502, { error: 'oauth_exchange_failed' })
    }
  })
}

/**
 * Provides the local OAuth token exchange endpoint without bundling the client secret.
 * @param environment - Vite-loaded environment values for the GitHub OAuth app.
 * @returns Vite plugin that installs dev and preview middlewares.
 * @example
 * githubOAuthTokenExchangePlugin(env)
 */
function githubOAuthTokenExchangePlugin(
  environment: OAuthTokenExchangeEnvironment,
): Plugin {
  return {
    configurePreviewServer(server) {
      installOAuthTokenExchangeMiddleware(server.middlewares, environment)
    },
    configureServer(server) {
      installOAuthTokenExchangeMiddleware(server.middlewares, environment)
    },
    name: 'github-oauth-token-exchange',
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      sourcemap: true,
    },
    plugins: [githubOAuthTokenExchangePlugin(environment), react()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: true,
      port: 3005,
    },
  }
})
