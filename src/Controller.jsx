import axios from 'axios'
import { useSetAtom } from 'jotai'
import { memo, useLayoutEffect } from 'react'

import App from './App'
import SignIn from './SignIn'

const Controller = () => {
  useLayoutEffect(() => {
    if (window.location.href.includes('?code=')) {
      const [url, code] = window.location.href.split('?code=')
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
        .then((res) => console.log(res))
      window.history.pushState({}, null, url.split('login')[0])
    }
  }, [window.location.href.includes('?code=')])
  return window.location.href.includes('?code=') ? <App /> : <SignIn />
}

export default memo(Controller)
