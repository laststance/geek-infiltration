import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { useAtom } from 'jotai'
import { useState, memo, useLayoutEffect } from 'react'

import App from '../App'
import { accessTokenAtom } from '../atom'

import LandingPage from './LandingPage'

const Authenticator = memo(() => {
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)
  const isAuthenticated = window.location.href.includes('?code=')
  useLayoutEffect(() => {
    if (isAuthenticated) {
      const [url, code] = window.location.href.split('?code=')
      setLoading(() => true)
      axios
        .post(
          '/login/oauth/access_token',
          {
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
            code: code,
          },
          {
            headers: {
              Accept: 'application/json',
            },
          }
        )
        .then(({ data }) => {
          setAccessToken(data['access_token'])
          setLoading(false)
        })
      window.history.pushState({}, '', url.split('login')[0])
    }
  }, [isAuthenticated])

  if (loading) <CircularProgress />
  return accessToken ? <App /> : <LandingPage />
})
Authenticator.displayName = 'Authenticator'
export default Authenticator
