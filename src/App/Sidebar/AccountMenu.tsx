import { Avatar } from '@mui/material'
import React, { memo, useCallback } from 'react'

import { logout } from '../../Authenticator/authenticatorSlice'
import { useAppDispatch } from '../../hooks/useAppDispatch'

const UserMenuButton: React.FC = memo(() => {
  const dispatch = useAppDispatch()

  const lgout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <Avatar
      onClick={lgout}
      src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
      sx={{ cursor: 'pointer' }}
    />
  )
})
UserMenuButton.displayName = 'AccountMenu'

export default UserMenuButton
