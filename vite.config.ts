import react from '@vitejs/plugin-react-swc'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv } from 'vite'
import type { Plugin, PreviewServer, ViteDevServer } from 'vite'

import githubOAuthCallbackFunction from './api/auth/github/callback'
import githubOAuthStartFunction from './api/auth/github/start'
import authLogoutFunction from './api/auth/logout'
import authSessionFunction from './api/auth/session'
import githubGraphqlFunction from './api/github/graphql'
import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  LOCAL_SERVER_PORT,
  SESSION_SECRET_MINIMUM_LENGTH,
} from './server/auth/constants'

const LOCAL_REQUEST_ORIGIN = `http://localhost:${LOCAL_SERVER_PORT}`

type ApiFunction = {
  fetch: (request: Request) => Promise<Response> | Response
}

type MiddlewareStack =
  ViteDevServer['middlewares'] | PreviewServer['middlewares']

const API_FUNCTIONS: Record<string, ApiFunction> = {
  '/api/auth/github/callback': githubOAuthCallbackFunction,
  '/api/auth/github/start': githubOAuthStartFunction,
  '/api/auth/logout': authLogoutFunction,
  '/api/auth/session': authSessionFunction,
  '/api/github/graphql': githubGraphqlFunction,
}

/**
 * Reads a JSON request body when Vite locally adapts an incoming request to the production Function contract.
 * @param request - Incoming Vite middleware request.
 * @returns Raw request body string.
 * @example
 * await readRequestBody(request) // => '{"query":"..."}'
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
 * Converts Node request headers into the Web Headers interface shared with Vercel Functions.
 * @param request - Incoming Vite middleware request.
 * @returns Web-standard request headers.
 * @example
 * createWebHeaders(request) // => Headers
 */
function createWebHeaders(request: IncomingMessage) {
  const headers = new Headers()

  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      // Multi-value Node headers become repeated Web Headers entries.
      for (const item of value) headers.append(name, item)
      continue
    }

    // Undefined Node header slots must not become the string "undefined".
    if (value !== undefined) headers.set(name, value)
  }

  return headers
}

/**
 * Adapts a local Vite request to the same Web Request API used by deployed Vercel Functions.
 * @param request - Incoming Vite middleware request.
 * @returns Web-standard request including method, headers, URL, and optional body.
 * @example
 * await createWebRequest(request)
 */
async function createWebRequest(request: IncomingMessage) {
  const forwardedProtocol = request.headers['x-forwarded-proto']
  const protocol =
    typeof forwardedProtocol === 'string' ? forwardedProtocol : 'http'
  const host = request.headers.host || new URL(LOCAL_REQUEST_ORIGIN).host
  const requestUrl = new URL(request.url || '/', `${protocol}://${host}`)
  const method = request.method || 'GET'
  const body =
    method === 'GET' || method === 'HEAD'
      ? undefined
      : await readRequestBody(request)

  return new Request(requestUrl, {
    body,
    headers: createWebHeaders(request),
    method,
  })
}

/**
 * Writes a Function Web Response back through Vite so local auth matches production behavior.
 * @param functionResponse - Response produced by a shared API Function.
 * @param response - Vite's Node response to complete.
 * @returns Resolves after the response body is sent.
 * @example
 * await writeFunctionResponse(functionResponse, response)
 */
async function writeFunctionResponse(
  functionResponse: Response,
  response: ServerResponse,
) {
  response.statusCode = functionResponse.status

  for (const [name, value] of functionResponse.headers.entries()) {
    // Set-Cookie needs special splitting below because Web Headers combines values.
    if (name === 'set-cookie') continue
    response.setHeader(name, value)
  }

  const setCookieHeader = functionResponse.headers.get('set-cookie')
  if (setCookieHeader) {
    // Node needs separate Set-Cookie values even though the Web Headers view combines them.
    response.setHeader(
      'Set-Cookie',
      setCookieHeader.split(/,(?=\s*__Host-geek-infiltration-)/),
    )
  }

  const responseBody = Buffer.from(await functionResponse.arrayBuffer())
  response.end(responseBody)
}

/**
 * Installs local adapters for every deployed API route while leaving assets and SPA routes to Vite.
 * @param middlewares - Vite middleware stack receiving local browser requests.
 * @returns Nothing.
 * @example
 * installApiFunctionMiddleware(server.middlewares)
 */
function installApiFunctionMiddleware(middlewares: MiddlewareStack) {
  middlewares.use(async (request, response, next) => {
    const pathname = new URL(request.url || '/', LOCAL_REQUEST_ORIGIN).pathname
    const apiFunction = API_FUNCTIONS[pathname]
    // Non-API paths continue through Vite's asset and SPA middleware.
    if (!apiFunction) {
      next()
      return
    }

    try {
      const webRequest = await createWebRequest(request)
      const functionResponse = await apiFunction.fetch(webRequest)
      await writeFunctionResponse(functionResponse, response)
    } catch {
      // Local adapter failures mirror a generic production server error.
      response.statusCode = HTTP_STATUS_INTERNAL_SERVER_ERROR
      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify({ error: 'local_api_adapter_failed' }))
    }
  })
}

/**
 * Loads server-only local credentials for shared Functions without exposing them through Vite's client env API.
 * @param environment - Values loaded from the active local Vite env file.
 * @param mode - Current Vite execution mode.
 * @returns Nothing.
 * @example
 * loadLocalServerEnvironment(environment, 'development')
 */
function loadLocalServerEnvironment(
  environment: Record<string, string>,
  mode: string,
) {
  const clientId = environment.GITHUB_CLIENT_ID || environment.VITE_CLIENT_ID
  const configuredSessionSecret =
    environment.GEEK_INFILTRATION_SESSION_SECRET ||
    environment.SESSION_SECRET ||
    ''
  const sessionSecret =
    configuredSessionSecret.length >= SESSION_SECRET_MINIMUM_LENGTH
      ? configuredSessionSecret
      : mode === 'development'
        ? environment.GITHUB_CLIENT_SECRET
        : ''
  const redirectUriCandidates = [
    environment.GITHUB_REDIRECT_URI,
    environment.VITE_REDIRECT_URI,
  ]
  let redirectUri = ''
  // Ignore absent or ambient placeholder values before selecting a local callback origin.
  for (const candidate of redirectUriCandidates) {
    // Empty candidates cannot define the local callback origin.
    if (!candidate) continue

    // Only absolute HTTP origins are safe inputs to URL construction.
    if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
      redirectUri = candidate
      break
    }
  }

  // Assign only present values so ambient shell configuration is not overwritten with empties.
  if (clientId) process.env.GITHUB_CLIENT_ID = clientId
  // OAuth code exchange needs the local client secret only inside server middleware.
  if (environment.GITHUB_CLIENT_SECRET) {
    process.env.GITHUB_CLIENT_SECRET = environment.GITHUB_CLIENT_SECRET
  }
  // Optional Redis configuration replaces the in-process local session store.
  if (environment.UPSTASH_REDIS_REST_URL) {
    process.env.UPSTASH_REDIS_REST_URL = environment.UPSTASH_REDIS_REST_URL
  }
  // Redis authentication stays in the Node process and never reaches Vite client env.
  if (environment.UPSTASH_REDIS_REST_TOKEN) {
    process.env.UPSTASH_REDIS_REST_TOKEN = environment.UPSTASH_REDIS_REST_TOKEN
  }
  // Valid callback origins override ambient placeholders only after URL validation.
  if (redirectUri) process.env.GITHUB_REDIRECT_URI = redirectUri
  // OAuth transaction encryption is available only with a sufficiently long secret.
  if (sessionSecret) {
    // Existing local setups remain usable while production still requires an independent session secret.
    process.env.GEEK_INFILTRATION_SESSION_SECRET = sessionSecret
  }
}

/**
 * Provides local equivalents of the deployed Vercel Functions for Vite dev and preview servers.
 * @returns Vite plugin that installs the shared API adapters.
 * @example
 * apiFunctionPlugin()
 */
function apiFunctionPlugin(): Plugin {
  return {
    configurePreviewServer(server) {
      installApiFunctionMiddleware(server.middlewares)
    },
    configureServer(server) {
      installApiFunctionMiddleware(server.middlewares)
    },
    name: 'local-api-functions',
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), '')
  loadLocalServerEnvironment(environment, mode)

  return {
    build: {
      sourcemap: true,
    },
    plugins: [apiFunctionPlugin(), react()],
    resolve: {
      tsconfigPaths: true,
    },
    server: {
      host: true,
      port: LOCAL_SERVER_PORT,
    },
  }
})
