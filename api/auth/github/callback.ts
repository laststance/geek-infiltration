import {
  GITHUB_OAUTH_TOKEN_URL,
  GITHUB_REQUEST_TIMEOUT_MS,
  HTTP_STATUS_FOUND,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  OAUTH_CALLBACK_PATH,
  OAUTH_TRANSACTION_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '../../../server/auth/constants.js'
import {
  readCookie,
  serializeHttpOnlyCookie,
} from '../../../server/auth/cookies.js'
import { readGitHubOAuthEnvironment } from '../../../server/auth/environment.js'
import { unsealOAuthTransaction } from '../../../server/auth/session.js'
import { authSessionStore } from '../../../server/auth/sessionStore.js'

/**
 * Returns the callback URI shared with GitHub so code exchange uses the exact authorize-time value.
 * @param request - OAuth callback request received by Vercel.
 * @returns Configured callback URI or the current same-origin Function path.
 * @example
 * resolveCallbackUrl(new Request('https://app.test/api/auth/github/callback'))
 */
function resolveCallbackUrl(request: Request) {
  return new URL(
    OAUTH_CALLBACK_PATH,
    process.env.GITHUB_REDIRECT_URI || new URL(request.url).origin,
  ).toString()
}

/**
 * Creates a same-origin redirect while atomically replacing or deleting protected authentication cookies.
 * @param destination - Absolute same-origin destination.
 * @param cookies - Set-Cookie values applied before navigation.
 * @returns Redirect response carrying every cookie mutation.
 * @example
 * createRedirect('https://app.test/app', ['session=...'])
 */
function createRedirect(destination: string, cookies: string[]) {
  const headers = new Headers({ Location: destination })
  // Browsers need separate Set-Cookie header entries for session creation and transaction cleanup.
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie)
  }

  return new Response(null, { headers, status: HTTP_STATUS_FOUND })
}

/**
 * Completes GitHub OAuth server-side and issues only an opaque HttpOnly application session.
 * @param request - GitHub callback containing authorization code and echoed state.
 * @returns App redirect with a new session, or landing redirect after any validation failure.
 * @example
 * await githubOAuthCallbackFunction.fetch(new Request('https://app.test/api/auth/github/callback?code=x&state=y'))
 */
async function completeGitHubOAuth(request: Request) {
  const requestUrl = new URL(request.url)
  const clearedTransactionCookie = serializeHttpOnlyCookie(
    OAUTH_TRANSACTION_COOKIE_NAME,
    '',
    0,
  )

  if (request.method !== 'GET') {
    // GitHub completes OAuth through a browser GET redirect only.
    return Response.json(
      { error: 'method_not_allowed' },
      { status: HTTP_STATUS_METHOD_NOT_ALLOWED },
    )
  }

  try {
    const environment = readGitHubOAuthEnvironment()
    const authorizationCode = requestUrl.searchParams.get('code')
    const returnedState = requestUrl.searchParams.get('state')
    const encryptedTransaction = readCookie(
      request,
      OAUTH_TRANSACTION_COOKIE_NAME,
    )
    // Missing authorization input cannot be safely exchanged for a credential.
    if (!authorizationCode || !returnedState || !encryptedTransaction) {
      throw new Error('OAuth callback is incomplete')
    }

    const transaction = await unsealOAuthTransaction(
      encryptedTransaction,
      environment.sessionSecret,
    )
    // The returned state must match the encrypted server-generated transaction.
    if (!transaction || transaction.state !== returnedState) {
      throw new Error('OAuth state validation failed')
    }

    const tokenRequestBody = new URLSearchParams({
      client_id: environment.clientId,
      client_secret: environment.clientSecret,
      code: authorizationCode,
      code_verifier: transaction.codeVerifier,
      redirect_uri: resolveCallbackUrl(request),
    })
    const githubResponse = await fetch(GITHUB_OAUTH_TOKEN_URL, {
      body: tokenRequestBody,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    })
    const tokenPayload: unknown = await githubResponse.json()
    // GitHub errors and malformed payloads must never create an application session.
    if (
      !githubResponse.ok ||
      tokenPayload === null ||
      typeof tokenPayload !== 'object' ||
      !('access_token' in tokenPayload) ||
      typeof tokenPayload.access_token !== 'string'
    ) {
      throw new Error('GitHub token exchange failed')
    }

    const sessionId = await authSessionStore.create(tokenPayload.access_token)
    const sessionCookie = serializeHttpOnlyCookie(
      SESSION_COOKIE_NAME,
      sessionId,
      SESSION_MAX_AGE_SECONDS,
    )

    return createRedirect(
      new URL(transaction.returnTo, requestUrl.origin).toString(),
      [sessionCookie, clearedTransactionCookie],
    )
  } catch {
    // Every callback failure clears transient OAuth state and returns a generic public error.
    const landingUrl = new URL('/', requestUrl.origin)
    landingUrl.searchParams.set('auth_error', 'github_oauth_failed')
    return createRedirect(landingUrl.toString(), [clearedTransactionCookie])
  }
}

const githubOAuthCallbackFunction = {
  fetch: completeGitHubOAuth,
}

export default githubOAuthCallbackFunction
