import SettingsIcon from '@mui/icons-material/Settings'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuList from '@mui/material/MenuList'
import React, { useCallback } from 'react'

import RemoveMenuItem from '@/components/RemoveMenuItem'
import Text from '@/components/Text'
import TimelineToolbar from '@/components/TimelineToolbar'
import useAnchorElement from '@/hooks/useAnchorElement'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { unsubscribe } from '@/redux/subscribedSlice'

interface Props {
  timelimeIndex: ArrayMapIndex
}

const Toolbar: React.FC<Props> = ({ timelimeIndex }) => {
  const dispatch = useAppDispatch()
  const { anchorEl, handleClick, handleClose, open } = useAnchorElement()
  const handleRemove = useCallback(() => {
    dispatch(unsubscribe(timelimeIndex))
  }, [timelimeIndex])

  return (
    <TimelineToolbar>
      <Text sx={{ flex: 'none' }}>TimeLine</Text>
      <IconButton sx={{ flex: 'none' }} onClick={handleClick}>
        <SettingsIcon />
      </IconButton>
      <Menu
        id="settings-menu"
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        transformOrigin={{
          horizontal: 'left',
          vertical: 'top',
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuList>
          <RemoveMenuItem key={1} handleClick={handleRemove} />
        </MenuList>
      </Menu>
    </TimelineToolbar>
  )
}
Toolbar.displayName = 'Toolbar'
export default Toolbar
