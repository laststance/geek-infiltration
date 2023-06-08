import { Avatar } from '@mui/material'
import { useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import React, { memo, useCallback } from 'react'

import { accessTokenAtom } from '../../atom'

const UserMenuButton: React.FC = memo(() => {
  const setAccessTokenAtom = useSetAtom(accessTokenAtom)

  const logout = useCallback(() => {
    setAccessTokenAtom(RESET)
  }, [setAccessTokenAtom])

  return (
    <Avatar
      onClick={logout}
      src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
      sx={{ cursor: 'pointer' }}
    />
  )
})
UserMenuButton.displayName = 'AccountMenu'

export default UserMenuButton
