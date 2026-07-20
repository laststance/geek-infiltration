import { SESSION_COOKIE_NAME } from '../constants.js'
import { readCookie } from '../cookies.js'
import { authSessionStore } from '../sessionStore.js'

/**
 * Resolves a server-side GitHub credential when session and GraphQL routes receive a valid opaque cookie ID.
 * @param request - Same-origin BFF request carrying an optional HttpOnly session cookie.
 * @returns Server-side session, or null when its ID is missing, expired, or invalid.
 * @example
 * await readValidatedAuthSession(new Request('https://app.test', { headers: { Cookie: '__Host-geek-infiltration-session=id' } }))
 */
export async function readValidatedAuthSession(request: Request) {
  const sessionId = readCookie(request, SESSION_COOKIE_NAME)

  // Requests without the protected cookie are always anonymous.
  if (!sessionId) return null

  return authSessionStore.read(sessionId)
}
