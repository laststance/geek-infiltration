import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { login } from '@/redux/authenticatorSlice'

type OAuthTokenResponse = {
  access_token?: string
}

/**
 * Exchanges a GitHub OAuth code for an access token through the existing Vite proxy.
 * @param authorizationCode - GitHub OAuth code from the callback URL.
 * @returns The token response returned by GitHub.
 * @example
 * await exchangeOAuthCodeForToken('mock-code')
 */
async function exchangeOAuthCodeForToken(authorizationCode: string) {
  const { data } = await axios.post<OAuthTokenResponse>(
    '/login/oauth/access_token',
    {
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      code: authorizationCode,
    },
    {
      headers: {
        Accept: 'application/json',
      },
    },
  )
  return data
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

  useEffect(() => {
    let shouldApplyResult = true

    if (authorizationCode === null) {
      navigate('/', { replace: true })
      return () => {
        shouldApplyResult = false
      }
    }

    exchangeOAuthCodeForToken(authorizationCode)
      .then((data) => {
        if (!shouldApplyResult) return

        if (data.access_token) {
          dispatch(login(data.access_token))
          navigate('/app', { replace: true })
          return
        }

        navigate('/', { replace: true })
      })
      .catch(() => {
        if (!shouldApplyResult) return

        // Failed callback exchanges should return to the public landing route.
        navigate('/', { replace: true })
      })

    return () => {
      shouldApplyResult = false
    }
  }, [authorizationCode, dispatch, navigate])

  return <FullScreenSpinner />
}
