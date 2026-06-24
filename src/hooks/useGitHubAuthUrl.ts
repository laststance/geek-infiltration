import { useCallback, useMemo } from 'react'

import { createGitHubAuthUrl } from '@/constants/GITHUB_AUTH_URL'
import {
  createGitHubOAuthState,
  storeGitHubOAuthState,
} from '@/constants/GITHUB_OAUTH_STATE'

type GitHubAuthUrlHookResult = {
  githubAuthUrl: string
  prepareGitHubAuth: () => void
}

/**
 * Builds a GitHub OAuth href and stores its state only when the CTA is clicked.
 * @returns OAuth href plus a click handler that prepares callback verification.
 * @example
 * const { githubAuthUrl, prepareGitHubAuth } = useGitHubAuthUrl()
 */
export function useGitHubAuthUrl(): GitHubAuthUrlHookResult {
  const oauthState = useMemo(() => createGitHubOAuthState(), [])
  const githubAuthUrl = useMemo(
    () => createGitHubAuthUrl(oauthState),
    [oauthState],
  )

  const prepareGitHubAuth = useCallback(() => {
    storeGitHubOAuthState(oauthState)
  }, [oauthState])

  return { githubAuthUrl, prepareGitHubAuth }
}
