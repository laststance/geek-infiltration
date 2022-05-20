import { useSetAtom } from 'jotai'
import { memo, useLayoutEffect } from 'react'

import App from './App'
import { codeAtom } from './atom'
import SignIn from './SignIn'

const Controller = () => {
  const setAtom = useSetAtom(codeAtom)
  useLayoutEffect(() => {
    if (window.location.href.includes('?code=')) {
      const [url, code] = window.location.href.split('?code=')
      setAtom(code)
      window.history.pushState({}, null, url.split('login')[0])
    }
  }, [window.location.href.includes('?code=')])
  return window.location.href.includes('?code=') ? <App /> : <SignIn />
}

export default memo(Controller)
