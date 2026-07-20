import { Avatar } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React, { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { api } from '../../constants/api'
import useAnchorElement from '../../hooks/useAnchorElement'
import { useAppDispatch } from '../../hooks/useAppDispatch'

/**
 * Renders account actions and ends the server session when an authenticated user selects logout.
 * @returns Sidebar account menu with profile, account, and logout actions.
 * @example
 * <UserMenuButton />
 */
const UserMenuButton: React.FC = memo(() => {
  const { anchorEl, handleClick, handleClose, open } = useAnchorElement()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  /**
   * Calls the BFF logout endpoint from the menu and clears user-specific API cache after success.
   * @returns Resolves after logout succeeds or stops without navigation when the BFF rejects it.
   * @example
   * await handleLogout()
   */
  const handleLogout = useCallback(async () => {
    handleClose()
    const response = await fetch('/api/auth/logout', {
      credentials: 'same-origin',
      method: 'POST',
    })
    // Failed logout keeps the current route so a transient server error does not fake sign-out.
    if (!response.ok) return

    // Remove user-specific GitHub results before the public route renders.
    dispatch(api.util.resetApiState())
    navigate('/', { replace: true })
  }, [dispatch, handleClose, navigate])

  return (
    <>
      <IconButton aria-label="Open account menu" onClick={handleClick}>
        <Avatar
          alt="GitHub account avatar"
          src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4"
          sx={{ cursor: 'pointer' }}
        />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={() => void handleLogout()}>Logout</MenuItem>
      </Menu>
    </>
  )
})
UserMenuButton.displayName = 'AccountMenu'

export default UserMenuButton
