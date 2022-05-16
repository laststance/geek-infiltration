import { useAtomValue } from 'jotai'
import { memo } from 'react'

import App from './App'
import { userAtom } from './atom'
import SignIn from './SignIn'

const Controller = () => {
  const user = useAtomValue(userAtom)
  return user ? <App /> : <SignIn />
}

export default memo(Controller)
