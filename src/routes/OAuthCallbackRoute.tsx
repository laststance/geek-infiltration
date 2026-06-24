import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import {
  clearStoredGitHubOAuthState,
  readStoredGitHubOAuthState,
} from '@/constants/GITHUB_OAUTH_STATE'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { login } from '@/redux/authenticatorSlice'

const OAUTH_EXCHANGE_TIMEOUT_MS = 10_000

type OAuthTokenResponse = {
  access_token?: string
}

/**
 * Exchanges a GitHub OAuth code for an access token through the existing Vite proxy.
 * @param authorizationCode - GitHub OAuth code from the callback URL.
 * @param signal - Abort signal that cancels the request when the route unmounts.
 * @returns The token response returned by GitHub.
 * @example
 * await exchangeOAuthCodeForToken('mock-code', abortController.signal)
 */
async function exchangeOAuthCodeForToken(
  authorizationCode: string,
  signal: AbortSignal,
) {
  const { data } = await axios.post<OAuthTokenResponse>(
    '/login/oauth/access_token',
    {
      code: authorizationCode,
    },
    {
      headers: {
        Accept: 'application/json',
      },
      signal,
      timeout: OAUTH_EXCHANGE_TIMEOUT_MS,
    },
  )
  return data
}

/**
 * Verifies GitHub returned the same OAuth state that the landing route stored.
 * @param returnedState - State query parameter from GitHub's callback.
 * @returns True when the stored state exists and matches the callback state.
 * @example
 * isValidReturnedOAuthState('state-token')
 */
function isValidReturnedOAuthState(returnedState: string | null) {
  const storedState = readStoredGitHubOAuthState()
  return (
    storedState !== null &&
    returnedState !== null &&
    storedState === returnedState
  )
}

/**
 * Handles GitHub's OAuth redirect and returns users to the authenticated timeline.
 * @returns A full-screen loading state while the token exchange is in flight.
 * @example
 * <Route path="/callback" Component={Component} />
 */
export function Component() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const authorizationCode = searchParams.get('code')
  const returnedState = searchParams.get('state')

  useEffect(() => {
    const abortController = new AbortController()
    let shouldApplyResult = true

    if (
      authorizationCode === null ||
      !isValidReturnedOAuthState(returnedState)
    ) {
      clearStoredGitHubOAuthState()
      navigate('/', { replace: true })
      return () => {
        shouldApplyResult = false
        abortController.abort()
      }
    }

    exchangeOAuthCodeForToken(authorizationCode, abortController.signal)
      .then((data) => {
        if (!shouldApplyResult) return

        clearStoredGitHubOAuthState()

        if (data.access_token) {
          dispatch(login(data.access_token))
          navigate('/app', { replace: true })
          return
        }

        navigate('/', { replace: true })
      })
      .catch(() => {
        if (!shouldApplyResult) return

        clearStoredGitHubOAuthState()

        // Failed callback exchanges should return to the public landing route.
        navigate('/', { replace: true })
      })

    return () => {
      shouldApplyResult = false
      abortController.abort()
    }
  }, [authorizationCode, dispatch, navigate, returnedState])

  return <FullScreenSpinner />
}
