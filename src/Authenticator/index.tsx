import { CircularProgress } from '@mui/material'
import axios from 'axios'
import { useState, memo, useLayoutEffect } from 'react'

import App from '../App'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import LandingPage from '../LandingPage'
import { login } from '../redux/authenticatorSlice'

const Authenticator = memo(() => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authenticator.accessToken)
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
          dispatch(login(data['access_token']))
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
