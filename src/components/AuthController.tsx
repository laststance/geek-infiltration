import { Loading } from '@nextui-org/react'
import axios from 'axios'
import { useAtom } from 'jotai'
import { useState, memo, useLayoutEffect } from 'react'

import App from '../App'
import { accessTokenAtom } from '../atom'

import SignIn from './SignIn'

const AuthController = memo(() => {
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useAtom(accessTokenAtom)

  useLayoutEffect(() => {
    if (window.location.href.includes('?code=')) {
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
  }, [window.location.href.includes('?code=')])

  if (loading) <Loading size="md" />
  return accessToken ? <App /> : <SignIn />
})
AuthController.displayName = 'AuthController'
export default AuthController
