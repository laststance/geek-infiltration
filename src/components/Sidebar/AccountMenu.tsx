import { Avatar, Card } from '@nextui-org/react'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import React, { memo, useCallback } from 'react'

import { accessTokenAtom } from '../../atom'

const AccountMenu: React.FC = memo(() => {
  const setAccessTokenAtom = useSetAtom(accessTokenAtom)

  const logout = useCallback(() => {
    setAccessTokenAtom(RESET)
  }, [setAccessTokenAtom])

  return (
    <Card.Footer isBlurred={true} as="footer" css={{ p: '20px 10px' }}>
      <Avatar
        onClick={logout}
        src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
        css={{ cursor: 'pointer' }}
      />
    </Card.Footer>
  )
})
AccountMenu.displayName = 'AccountMenu'

export default AccountMenu
