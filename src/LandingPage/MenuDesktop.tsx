import type { LinkProps } from '@mui/material'
import {
  Box,
  Link,
  Grid,
  List,
  Stack,
  Popover,
  ListItem,
  ListSubheader,
  CardActionArea,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
// @mui

// components
import Iconify from './Iconify'
//
import type { MenuProps, MenuItemProps } from './type'

// ----------------------------------------------------------------------

interface RouterLinkProps extends LinkProps {
  component?: ReactNode
  to?: string
}

const LinkStyle = styled(Link)<RouterLinkProps>(({ theme }) => ({
  ...theme.typography.subtitle2,
  '&:hover': {
    opacity: 0.48,
    textDecoration: 'none',
  },
  color: theme.palette.text.primary,
  marginRight: theme.spacing(5),
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}))

const ListItemStyle = styled(ListItem)<RouterLinkProps>(({ theme }) => ({
  ...theme.typography.body2,
  '&:hover': {
    color: theme.palette.text.primary,
  },
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(3),
  padding: 0,
  transition: theme.transitions.create('color'),
}))

// ----------------------------------------------------------------------

export default function MenuDesktop({ isOffset, navConfig }: MenuProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      handleClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Stack direction="row">
      {navConfig.map((link) => (
        <MenuDesktopItem
          key={link.title}
          item={link}
          isOpen={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOffset={isOffset}
        />
      ))}
    </Stack>
  )
}

// ----------------------------------------------------------------------

export type IconBulletProps = {
  type?: 'subheader' | 'item'
}

function IconBullet({ type = 'item' }: IconBulletProps) {
  return (
    <Box sx={{ alignItems: 'center', display: 'flex', height: 16, width: 24 }}>
      <Box
        component="span"
        sx={{
          bgcolor: 'currentColor',
          borderRadius: '50%',
          height: 4,
          ml: '2px',
          width: 4,
          ...(type !== 'item' && {
            borderRadius: 2,
            height: 2,
            ml: 0,
            width: 8,
          }),
        }}
      />
    </Box>
  )
}

// ----------------------------------------------------------------------

type MenuDesktopItemProps = {
  item: MenuItemProps
  isOpen: boolean
  isOffset: boolean
  onOpen: VoidFunction
  onClose: VoidFunction
}

function MenuDesktopItem({
  item,
  isOpen,
  isOffset,
  onOpen,
  onClose,
}: MenuDesktopItemProps) {
  const { title, path, children } = item

  if (children) {
    return (
      <>
        <LinkStyle
          onClick={onOpen}
          sx={{
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            ...{ color: 'common.white' },
            ...(isOffset && { color: 'text.primary' }),
            ...(isOpen && { opacity: 0.48 }),
          }}
        >
          {title}
          <Iconify
            icon={
              isOpen
                ? 'eva:arrow-ios-upward-fill'
                : 'eva:arrow-ios-downward-fill'
            }
            sx={{ height: 16, ml: 0.5, width: 16 }}
          />
        </LinkStyle>

        <Popover
          open={isOpen}
          anchorReference="anchorPosition"
          anchorPosition={{ left: 0, top: 80 }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'center', vertical: 'top' }}
          onClose={onClose}
          PaperProps={{
            sx: {
              borderRadius: 2,
              boxShadow: (theme) => theme.customShadows.z24,
              m: 'auto',
              maxWidth: (theme) => theme.breakpoints.values.lg,
              pb: 3,
              pt: 5,
              px: 3,
              right: 16,
            },
          }}
        >
          <Grid container spacing={3}>
            {children.map((list) => {
              const { subheader, items } = list

              return (
                <Grid
                  key={subheader}
                  item
                  xs={12}
                  md={subheader === 'Dashboard' ? 6 : 2}
                >
                  <List disablePadding>
                    <ListSubheader
                      disableSticky
                      disableGutters
                      sx={{
                        alignItems: 'center',
                        color: 'text.primary',
                        display: 'flex',
                        lineHeight: 'unset',
                        typography: 'overline',
                      }}
                    >
                      <IconBullet type="subheader" /> {subheader}
                    </ListSubheader>

                    {items.map((item) => (
                      <ListItemStyle
                        key={item.title}
                        to={item.path}
                        underline="none"
                        sx={{
                          '&.active': {
                            color: 'text.primary',
                            typography: 'subtitle2',
                          },
                        }}
                      >
                        {item.title === 'Dashboard' ? (
                          <CardActionArea
                            sx={{
                              bgcolor: 'background.neutral',
                              borderRadius: 2,
                              color: 'primary.main',
                              px: 10,
                              py: 5,
                            }}
                          >
                            <Box
                              component={m.img}
                              whileTap="tap"
                              whileHover="hover"
                              variants={{
                                hover: { scale: 1.02 },
                                tap: { scale: 0.98 },
                              }}
                              src="https://minimal-assets-api.vercel.app/assets/illustrations/illustration_dashboard.png"
                            />
                          </CardActionArea>
                        ) : (
                          <>
                            <IconBullet />
                            {item.title}
                          </>
                        )}
                      </ListItemStyle>
                    ))}
                  </List>
                </Grid>
              )
            })}
          </Grid>
        </Popover>
      </>
    )
  }

  if (title === 'Documentation') {
    return (
      <LinkStyle
        href={path}
        target="_blank"
        rel="noopener"
        sx={{
          ...{ color: 'common.white' },
          ...(isOffset && { color: 'text.primary' }),
        }}
      >
        {title}
      </LinkStyle>
    )
  }

  return (
    <LinkStyle
      to={path}
      sx={{
        ...{ color: 'common.white' },
        ...(isOffset && { color: 'text.primary' }),
        '&.active': {
          color: 'primary.main',
        },
      }}
    >
      {title}
    </LinkStyle>
  )
}
