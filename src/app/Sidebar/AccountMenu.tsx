import { Avatar } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { memo, useCallback } from 'react'

import useAnchorElement from '../../hooks/useAnchorElement'
import { useAppDispatch } from '../../hooks/useAppDispatch'
import { logout } from '../../redux/authenticatorSlice'

const UserMenuButton: React.FC = memo(() => {
  const { anchorEl, handleClick, handleClose, open } = useAnchorElement()
  const dispatch = useAppDispatch()

  const handleLogout = useCallback(() => {
    dispatch(logout())
  }, [dispatch])

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar
          src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
          sx={{ cursor: 'pointer' }}
        />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  )
})
UserMenuButton.displayName = 'AccountMenu'

export default UserMenuButton
