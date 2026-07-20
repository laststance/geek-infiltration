import {
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_NO_CONTENT,
  SESSION_COOKIE_NAME,
} from '../../server/auth/constants'
import { readCookie, serializeHttpOnlyCookie } from '../../server/auth/cookies'
import { authSessionStore } from '../../server/auth/sessionStore'

/**
 * Ends the browser session when the account menu posts logout, without exposing or revoking credentials client-side.
 * @param request - Same-origin logout request.
 * @returns Empty response that immediately expires the HttpOnly session cookie.
 * @example
 * await authLogoutFunction.fetch(new Request('https://app.test/api/auth/logout', { method: 'POST' }))
 */
async function logout(request: Request) {
  if (request.method !== 'POST') {
    // Logout changes authentication state and therefore rejects safe-method navigation.
    return Response.json(
      { error: 'method_not_allowed' },
      { status: HTTP_STATUS_METHOD_NOT_ALLOWED },
    )
  }

  const sessionId = readCookie(request, SESSION_COOKIE_NAME)
  try {
    // Remove the Redis credential before the browser loses its opaque session ID.
    if (sessionId) await authSessionStore.delete(sessionId)
  } catch (error) {
    // Cookie expiry still signs the browser out while Redis TTL bounds a transient cleanup failure.
    console.error('Server session cleanup failed', error)
  }

  return new Response(null, {
    headers: {
      'Cache-Control': 'no-store',
      'Set-Cookie': serializeHttpOnlyCookie(SESSION_COOKIE_NAME, '', 0),
    },
    status: HTTP_STATUS_NO_CONTENT,
  })
}

const authLogoutFunction = {
  fetch: logout,
}

export default authLogoutFunction
