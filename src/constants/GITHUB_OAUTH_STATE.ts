const GITHUB_OAUTH_STATE_STORAGE_KEY = 'geek-infiltration:github-oauth-state'

/**
 * Generates the CSRF state GitHub will echo back to the callback route.
 * @returns A browser-generated random state token.
 * @example
 * createGitHubOAuthState() // => "2f4c..."
 */
export function createGitHubOAuthState() {
  if (typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID()
  }

  const bytes = new Uint8Array(16)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  )
}

/**
 * Stores the expected OAuth state for the callback verifier.
 * @param state - Random state token included in the GitHub authorize URL.
 * @returns Nothing; storage failures make the callback fail closed.
 * @example
 * storeGitHubOAuthState('state-token')
 */
export function storeGitHubOAuthState(state: string) {
  try {
    window.sessionStorage.setItem(GITHUB_OAUTH_STATE_STORAGE_KEY, state)
  } catch {
    // If storage is unavailable, the callback cannot verify state and will fail closed.
  }
}

/**
 * Reads the OAuth state stored before redirecting to GitHub.
 * @returns Stored state token, or null when unavailable.
 * @example
 * readStoredGitHubOAuthState()
 */
export function readStoredGitHubOAuthState() {
  try {
    return window.sessionStorage.getItem(GITHUB_OAUTH_STATE_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Clears the stored OAuth state once a callback succeeds or fails.
 * @returns Nothing.
 * @example
 * clearStoredGitHubOAuthState()
 */
export function clearStoredGitHubOAuthState() {
  try {
    window.sessionStorage.removeItem(GITHUB_OAUTH_STATE_STORAGE_KEY)
  } catch {
    // Storage can be disabled in privacy modes; cleanup remains best-effort.
  }
}
