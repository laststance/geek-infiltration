import {
  Avatar,
  Typography,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useRef, useState } from 'react'

// @mui
// utils

import { _contacts } from './_mock'
import { IconButtonAnimate } from './animate'
import BadgeStatus from './BadgeStatus'
import { fToNow } from './formatTime'
// _mock_
// components
import Iconify from './Iconify'
import MenuPopover from './MenuPopover'
import Scrollbar from './Scrollbar'

// ----------------------------------------------------------------------

const ITEM_HEIGHT = 64
const PADDING_ITEM = 1.5

// ----------------------------------------------------------------------

export default function ContactsPopover() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <IconButtonAnimate
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{
          ...(open && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.focusOpacity
              ),
          }),
        }}
      >
        <Iconify icon={'eva:people-fill'} width={20} height={20} />
      </IconButtonAnimate>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ p: 1, width: 360 }}
      >
        <Typography variant="h6" sx={{ p: PADDING_ITEM }}>
          Contacts{' '}
          <Typography component="span">({_contacts.length})</Typography>
        </Typography>

        <Scrollbar sx={{ height: ITEM_HEIGHT * 8 }}>
          {_contacts.map((contact) => (
            <ListItemButton
              key={contact.id}
              sx={{ borderRadius: 1, height: ITEM_HEIGHT, px: PADDING_ITEM }}
            >
              <ListItemAvatar sx={{ position: 'relative' }}>
                <Avatar src={contact.avatar} />
                <BadgeStatus
                  status={contact.status}
                  sx={{ bottom: 1, position: 'absolute', right: 1 }}
                />
              </ListItemAvatar>
              <ListItemText
                primaryTypographyProps={{ mb: 0.25, typography: 'subtitle2' }}
                secondaryTypographyProps={{ typography: 'caption' }}
                primary={contact.name}
                secondary={
                  contact.status === 'offline' && fToNow(contact.lastActivity)
                }
              />
            </ListItemButton>
          ))}
        </Scrollbar>
      </MenuPopover>
    </>
  )
}
