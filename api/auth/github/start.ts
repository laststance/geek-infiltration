import { createHash, randomBytes } from 'node:crypto'

import {
  DEFAULT_AUTHENTICATED_PATH,
  GITHUB_OAUTH_AUTHORIZE_URL,
  GITHUB_OAUTH_SCOPE,
  HTTP_STATUS_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  OAUTH_CALLBACK_PATH,
  OAUTH_TRANSACTION_COOKIE_NAME,
  OAUTH_TRANSACTION_MAX_AGE_SECONDS,
  RANDOM_TOKEN_BYTE_LENGTH,
} from '../../../server/auth/constants.js'
import { serializeHttpOnlyCookie } from '../../../server/auth/cookies.js'
import { readGitHubOAuthEnvironment } from '../../../server/auth/environment.js'
import { sealOAuthTransaction } from '../../../server/auth/session.js'

/**
 * Keeps post-login navigation on this application when the OAuth start endpoint receives a return target.
 * @param candidate - Optional path requested by the browser.
 * @param applicationOrigin - Exact same origin allowed after OAuth completes.
 * @returns A local absolute path, falling back to the authenticated app.
 * @example
 * normalizeReturnTo('/releases', 'https://app.test') // => '/releases'
 */
function normalizeReturnTo(
  candidate: string | null,
  applicationOrigin: string,
) {
  // Empty, relative-looking, and protocol-relative edge cases fall back to the app.
  if (!candidate?.startsWith('/') || candidate.startsWith('//')) {
    return DEFAULT_AUTHENTICATED_PATH
  }

  try {
    const returnUrl = new URL(candidate, applicationOrigin)
    // URL parsing catches backslash variants that browsers can reinterpret as another host.
    if (returnUrl.origin !== applicationOrigin) {
      return DEFAULT_AUTHENTICATED_PATH
    }

    return `${returnUrl.pathname}${returnUrl.search}${returnUrl.hash}`
  } catch {
    // Invalid URL syntax must never block login or become an open redirect.
    return DEFAULT_AUTHENTICATED_PATH
  }
}

/**
 * Starts GitHub OAuth from the BFF so state and PKCE material never enter browser-readable storage.
 * @param request - Same-origin GET request from a login CTA.
 * @returns GitHub redirect with an encrypted HttpOnly transaction cookie.
 * @example
 * await githubOAuthStartFunction.fetch(new Request('https://app.test/api/auth/github/start'))
 */
async function startGitHubOAuth(request: Request) {
  if (request.method !== 'GET') {
    // OAuth initiation is navigation-only and rejects state-changing verbs.
    return Response.json(
      { error: 'method_not_allowed' },
      { status: HTTP_STATUS_METHOD_NOT_ALLOWED },
    )
  }

  try {
    const environment = readGitHubOAuthEnvironment()
    const requestUrl = new URL(request.url)
    const callbackUrl = new URL(
      OAUTH_CALLBACK_PATH,
      process.env.GITHUB_REDIRECT_URI || requestUrl.origin,
    ).toString()
    const state = randomBytes(RANDOM_TOKEN_BYTE_LENGTH).toString('base64url')
    const codeVerifier = randomBytes(RANDOM_TOKEN_BYTE_LENGTH).toString(
      'base64url',
    )
    const codeChallenge = createHash('sha256')
      .update(codeVerifier)
      .digest('base64url')
    const transaction = await sealOAuthTransaction(
      {
        codeVerifier,
        returnTo: normalizeReturnTo(
          requestUrl.searchParams.get('returnTo'),
          requestUrl.origin,
        ),
        state,
      },
      environment.sessionSecret,
    )
    const authorizationUrl = new URL(GITHUB_OAUTH_AUTHORIZE_URL)
    authorizationUrl.searchParams.set('client_id', environment.clientId)
    authorizationUrl.searchParams.set('redirect_uri', callbackUrl)
    authorizationUrl.searchParams.set('scope', GITHUB_OAUTH_SCOPE)
    authorizationUrl.searchParams.set('state', state)
    authorizationUrl.searchParams.set('code_challenge', codeChallenge)
    authorizationUrl.searchParams.set('code_challenge_method', 'S256')

    return new Response(null, {
      headers: {
        Location: authorizationUrl.toString(),
        'Set-Cookie': serializeHttpOnlyCookie(
          OAUTH_TRANSACTION_COOKIE_NAME,
          transaction,
          OAUTH_TRANSACTION_MAX_AGE_SECONDS,
        ),
      },
      status: HTTP_STATUS_FOUND,
    })
  } catch (error) {
    // Missing secrets or crypto failures return a generic setup error without redirecting.
    console.error('GitHub OAuth start failed', error)
    return Response.json(
      { error: 'oauth_server_not_configured' },
      { status: HTTP_STATUS_INTERNAL_SERVER_ERROR },
    )
  }
}

const githubOAuthStartFunction = {
  fetch: startGitHubOAuth,
}

export default githubOAuthStartFunction
