/**
 * Serializes a secure same-origin server session cookie whenever authentication state changes.
 * @param name - Host-only cookie name.
 * @param value - Opaque encrypted cookie value.
 * @param maxAgeSeconds - Browser lifetime in seconds.
 * @returns Set-Cookie header value inaccessible to browser JavaScript.
 * @example
 * serializeHttpOnlyCookie('__Host-session', 'opaque', 600)
 */
export function serializeHttpOnlyCookie(
  name: string,
  value: string,
  maxAgeSeconds: number,
) {
  return `${name}=${value}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; Secure; SameSite=Lax`
}

/**
 * Reads one opaque cookie when a BFF route needs server-owned OAuth or session state.
 * @param request - Incoming same-origin request carrying browser cookies.
 * @param name - Exact cookie name to locate.
 * @returns Cookie value, or null when it is absent.
 * @example
 * readCookie(new Request('https://app.test', { headers: { Cookie: 'session=value' } }), 'session') // => 'value'
 */
export function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get('cookie')
  // BFF requests without any Cookie header have no protected state to read.
  if (!cookieHeader) return null

  // Inspect each cookie independently because values may contain '=' padding.
  for (const cookie of cookieHeader.split(';')) {
    const separatorIndex = cookie.indexOf('=')
    // Ignore malformed cookie fragments rather than treating them as a session.
    if (separatorIndex < 0) continue

    const cookieName = cookie.slice(0, separatorIndex).trim()
    // Return only the exact host-only cookie requested by the caller.
    if (cookieName === name) {
      return cookie.slice(separatorIndex + 1).trim()
    }
  }

  return null
}
