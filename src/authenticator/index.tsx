import axios from 'axios'
import { Suspense, lazy, useState, memo, useEffect } from 'react'

import { FullScreenSpinner } from '@/components/FullScreenSpinner'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { login } from '@/redux/authenticatorSlice'

const App = lazy(async () => import('@/app'))
const LandingPage = lazy(async () => import('@/LandingPage'))

const Authenticator = memo(() => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector((state) => state.authenticator.accessToken)
  const isAuthenticated = window.location.href.includes('?code=')

  useEffect(() => {
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
          },
        )
        .then(({ data }) => {
          dispatch(login(data['access_token']))
          setLoading(false)
        })
      window.history.pushState({}, '', url.split('login')[0])
    }
  }, [isAuthenticated])

  if (loading) <FullScreenSpinner />
  return (
    <Suspense fallback={<FullScreenSpinner />}>
      {accessToken ? <App /> : <LandingPage />}
    </Suspense>
  )
})
Authenticator.displayName = 'Authenticator'
export default Authenticator
