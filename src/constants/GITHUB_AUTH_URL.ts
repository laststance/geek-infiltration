const GITHUB_OAUTH_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize'
const GITHUB_OAUTH_SCOPE = 'user'

/**
 * Resolves the callback URL GitHub should return to after authorization.
 * @returns The configured redirect URI, or the local `/callback` route.
 * @example
 * getGitHubOAuthRedirectUri() // => "http://localhost:3005/callback"
 */
function getGitHubOAuthRedirectUri() {
  const configuredRedirectUri = import.meta.env.VITE_REDIRECT_URI || ''
  const redirectBaseUrl = configuredRedirectUri || window.location.origin
  return new URL('/callback', redirectBaseUrl).toString()
}

/**
 * Builds the GitHub OAuth authorize URL used by every landing CTA.
 * @param oauthState - CSRF token that the callback route will verify.
 * @returns A GitHub authorize URL with client id, scope, and callback route.
 * @example
 * createGitHubAuthUrl('state-token') // => "https://github.com/login/oauth/authorize?..."
 */
export function createGitHubAuthUrl(oauthState: string) {
  const githubAuthUrl = new URL(GITHUB_OAUTH_AUTHORIZE_URL)
  githubAuthUrl.searchParams.set('scope', GITHUB_OAUTH_SCOPE)
  githubAuthUrl.searchParams.set('client_id', import.meta.env.VITE_CLIENT_ID)
  githubAuthUrl.searchParams.set('redirect_uri', getGitHubOAuthRedirectUri())
  githubAuthUrl.searchParams.set('state', oauthState)
  return githubAuthUrl.toString()
}
