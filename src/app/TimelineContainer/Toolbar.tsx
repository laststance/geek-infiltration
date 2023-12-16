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
  id: TimelineProperty['id']
  information: TimelineProperty['information']
  aim: TimelineProperty['aim']
}

const Toolbar: React.FC<Props> = ({ id, information, aim }) => {
  const dispatch = useAppDispatch()
  const { anchorEl, handleClick, handleClose, open } = useAnchorElement()
  const handleRemove = useCallback(() => {
    dispatch(unsubscribe(id))
  }, [id])

  return (
    <TimelineToolbar>
      <Text variant="h5" noWrap sx={{ flex: 'none' }}>
        {aim.user ? aim.user : aim.repo}
      </Text>
      <Text variant="subtitle1" noWrap>
        {information}
      </Text>
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
