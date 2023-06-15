import type { LinkProps, ListItemButtonProps } from '@mui/material'
import {
  Box,
  List,
  Drawer,
  Collapse,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'

import { IconButtonAnimate } from './animate'
import { DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT } from './config'
// components
import Iconify from './Iconify'
import Logo from './Logo'
import NavSection from './nav-section'
import Scrollbar from './Scrollbar'
import type { MenuProps, MenuItemProps } from './type'

// ----------------------------------------------------------------------

type StyleProps = LinkProps & ListItemButtonProps

interface ListItemStyleProps extends StyleProps {
  component?: ReactNode
  to?: string
}

const ListItemStyle = styled(ListItemButton)<ListItemStyleProps>(
  ({ theme }) => ({
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    height: DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT,
    textTransform: 'capitalize',
  })
)

// ----------------------------------------------------------------------

export default function MenuMobile({ isOffset, navConfig }: MenuProps) {
  const [open, setOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (drawerOpen) {
      handleDrawerClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => {
    setOpen(!open)
  }

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  return (
    <>
      <IconButtonAnimate
        onClick={handleDrawerOpen}
        sx={{
          ml: 1,
          ...{ color: 'common.white' },
          ...(isOffset && { color: 'text.primary' }),
        }}
      >
        <Iconify icon={'eva:menu-2-fill'} />
      </IconButtonAnimate>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{ sx: { pb: 5, width: 260 } }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} />

          <List disablePadding>
            {navConfig.map((link) => (
              <MenuMobileItem
                key={link.title}
                item={link}
                isOpen={open}
                onOpen={handleOpen}
              />
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  )
}

// ----------------------------------------------------------------------

type MenuMobileItemProps = {
  item: MenuItemProps
  isOpen: boolean
  onOpen: VoidFunction
}

function MenuMobileItem({ item, isOpen, onOpen }: MenuMobileItemProps) {
  const { title, path, icon, children } = item

  if (children) {
    return (
      <>
        <ListItemStyle onClick={onOpen}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText disableTypography primary={title} />
          <Iconify
            icon={
              isOpen
                ? 'eva:arrow-ios-downward-fill'
                : 'eva:arrow-ios-forward-fill'
            }
            sx={{ height: 16, ml: 1, width: 16 }}
          />
        </ListItemStyle>

        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
            <NavSection
              navConfig={children}
              sx={{
                '& .MuiList-root:last-of-type .MuiListItemButton-root': {
                  '& > *:not(.MuiTouchRipple-root)': { display: 'none' },
                  backgroundImage:
                    'url(https://minimal-assets-api.vercel.app/assets/illustrations/illustration_dashboard.png)',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  bgcolor: 'background.neutral',
                  height: 200,
                },
              }}
            />
          </Box>
        </Collapse>
      </>
    )
  }

  if (title === 'Documentation') {
    return (
      <ListItemStyle href={path} target="_blank" rel="noopener">
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText disableTypography primary={title} />
      </ListItemStyle>
    )
  }

  return (
    <ListItemStyle
      to={path}
      sx={{
        '&.active': {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
          color: 'primary.main',
          fontWeight: 'fontWeightMedium',
        },
      }}
    >
      <ListItemIcon> {icon}</ListItemIcon>
      <ListItemText disableTypography primary={title} />
    </ListItemStyle>
  )
}
