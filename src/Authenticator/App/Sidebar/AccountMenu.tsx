import { Avatar, Card, CardMedia } from '@mui/material'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import React, { memo, useCallback } from 'react'

import { accessTokenAtom } from '../../../atom'

const AccountMenu: React.FC = memo(() => {
  const setAccessTokenAtom = useSetAtom(accessTokenAtom)

  const logout = useCallback(() => {
    setAccessTokenAtom(RESET)
  }, [setAccessTokenAtom])

  return (
    <Card sx={{ p: '20px 10px' }}>
      <CardMedia>
        <Avatar
          onClick={logout}
          src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
          sx={{ cursor: 'pointer' }}
        />
      </CardMedia>
    </Card>
  )
})
AccountMenu.displayName = 'AccountMenu'

export default AccountMenu
