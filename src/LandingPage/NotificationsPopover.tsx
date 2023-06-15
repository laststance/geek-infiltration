import {
  Box,
  List,
  Badge,
  Button,
  Avatar,
  Tooltip,
  Divider,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material'
import { noCase } from 'change-case'
import { useRef, useState } from 'react'

// @mui
// utils

import { _notifications } from './_mock'
import { IconButtonAnimate } from './animate'
import { fToNow } from './formatTime'
// _mock_
// components
import Iconify from './Iconify'
import MenuPopover from './MenuPopover'
import Scrollbar from './Scrollbar'

// ----------------------------------------------------------------------

export default function NotificationsPopover() {
  const anchorRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState(_notifications)
  const totalUnRead = notifications.filter(
    (item) => item.isUnRead === true
  ).length

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    )
  }

  return (
    <>
      <IconButtonAnimate
        ref={anchorRef}
        size="large"
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={open}
        onClose={handleClose}
        anchorEl={anchorRef.current}
        sx={{ width: 360 }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', px: 2.5, py: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              You have {totalUnRead} unread messages
            </Typography>
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButtonAnimate color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButtonAnimate>
            </Tooltip>
          )}
        </Box>

        <Divider />

        <Scrollbar sx={{ height: { sm: 'auto', xs: 340 } }}>
          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ px: 2.5, py: 1, typography: 'overline' }}
              >
                New
              </ListSubheader>
            }
          >
            {notifications.slice(0, 2).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>

          <List
            disablePadding
            subheader={
              <ListSubheader
                disableSticky
                sx={{ px: 2.5, py: 1, typography: 'overline' }}
              >
                Before that
              </ListSubheader>
            }
          >
            {notifications.slice(2, 5).map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
          </List>
        </Scrollbar>

        <Divider />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  )
}

// ----------------------------------------------------------------------

type NotificationItemProps = {
  id: string
  title: string
  description: string
  avatar: string | null
  type: string
  createdAt: Date
  isUnRead: boolean
}

function NotificationItem({
  notification,
}: {
  notification: NotificationItemProps
}) {
  const { avatar, title } = renderContent(notification)

  return (
    <ListItemButton
      sx={{
        mt: '1px',
        px: 2.5,
        py: 1.5,
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              alignItems: 'center',
              color: 'text.disabled',
              display: 'flex',
              mt: 0.5,
            }}
          >
            <Iconify
              icon="eva:clock-outline"
              sx={{ height: 16, mr: 0.5, width: 16 }}
            />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationItemProps) {
  const title = (
    <Typography variant="subtitle2">
      {notification.title}
      <Typography
        component="span"
        variant="body2"
        sx={{ color: 'text.secondary' }}
      >
        &nbsp; {noCase(notification.description)}
      </Typography>
    </Typography>
  )

  if (notification.type === 'order_placed') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'order_shipped') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_shipping.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'mail') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_mail.svg"
        />
      ),
      title,
    }
  }
  if (notification.type === 'chat_message') {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    }
  }
  return {
    avatar: notification.avatar ? (
      <img alt={notification.title} src={notification.avatar} />
    ) : null,
    title,
  }
}
