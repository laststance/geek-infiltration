/**
 * Checks the BFF session when React Router enters a public or protected route and fails closed on network errors.
 * @returns True only when the server validates the HttpOnly session cookie.
 * @example
 * await readAuthSession() // => true
 */
export async function readAuthSession() {
  try {
    const response = await fetch('/api/auth/session', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
    // Non-success responses include missing server configuration and fail closed.
    if (!response.ok) return false

    const payload: unknown = await response.json()
    return (
      payload !== null &&
      typeof payload === 'object' &&
      'authenticated' in payload &&
      typeof payload.authenticated === 'boolean' &&
      payload.authenticated
    )
  } catch {
    // Route guards treat network and JSON failures as signed-out state.
    return false
  }
}
