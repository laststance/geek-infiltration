import { SESSION_SECRET_MINIMUM_LENGTH } from './constants'

type GitHubOAuthEnvironment = {
  clientId: string
  clientSecret: string
  sessionSecret: string
}

/**
 * Reads the encryption secret for routes that validate sessions without needing GitHub OAuth credentials.
 * @returns A high-entropy session secret with the required minimum length.
 * @example
 * readSessionSecret() // => 'server-only-secret...'
 */
export function readSessionSecret() {
  const sessionSecret = process.env.GEEK_INFILTRATION_SESSION_SECRET

  // Short or absent secrets cannot safely seal OAuth state and PKCE material.
  if (!sessionSecret || sessionSecret.length < SESSION_SECRET_MINIMUM_LENGTH) {
    throw new Error(
      'GEEK_INFILTRATION_SESSION_SECRET must contain at least 32 characters',
    )
  }

  return sessionSecret
}

/**
 * Reads required OAuth secrets when a server route starts so missing Vercel configuration fails closed.
 * @returns Validated GitHub OAuth and encrypted-session credentials.
 * @example
 * readGitHubOAuthEnvironment() // => { clientId, clientSecret, sessionSecret }
 */
export function readGitHubOAuthEnvironment(): GitHubOAuthEnvironment {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const sessionSecret = readSessionSecret()

  // OAuth start and callback must fail closed before contacting GitHub.
  if (!clientId || !clientSecret) {
    throw new Error('GitHub OAuth server environment is incomplete')
  }

  return { clientId, clientSecret, sessionSecret }
}
