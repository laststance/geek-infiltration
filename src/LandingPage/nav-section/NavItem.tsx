import type { LinkProps, ListItemButtonProps } from '@mui/material'
import { Box, ListItemText, ListItemButton, ListItemIcon } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import type { ReactNode } from 'react'

import {
  DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT,
  DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT,
  DASHBOARD_NAVBAR_ICON_ITEM_SIZE,
} from '../config'
import Iconify from '../Iconify'

import type { NavItemProps } from './type'

// ----------------------------------------------------------------------

type IProps = LinkProps & ListItemButtonProps

interface ListItemStyleProps extends IProps {
  component?: ReactNode
  to?: string
  activeRoot?: boolean
  activeSub?: boolean
  subItem?: boolean
}

const ListItemStyle = styled(ListItemButton, {
  shouldForwardProp: (prop) =>
    prop !== 'activeRoot' && prop !== 'activeSub' && prop !== 'subItem',
})<ListItemStyleProps>(({ activeRoot, activeSub, subItem, theme }) => ({
  ...theme.typography.body2,
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  height: DASHBOARD_NAVBAR_ROOT_ITEM_HEIGHT,
  marginBottom: theme.spacing(0.5),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(1.5),
  position: 'relative',
  textTransform: 'capitalize',
  // activeRoot
  ...(activeRoot && {
    ...theme.typography.subtitle2,
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.selectedOpacity
    ),
    color: theme.palette.primary.main,
  }),
  // activeSub
  ...(activeSub && {
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
  }),
  // subItem
  ...(subItem && {
    height: DASHBOARD_NAVBAR_SUB_ITEM_HEIGHT,
  }),
}))

interface ListItemTextStyleProps extends ListItemButtonProps {
  isCollapse?: boolean
}

const ListItemTextStyle = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== 'isCollapse',
})<ListItemTextStyleProps>(({ isCollapse, theme }) => ({
  transition: theme.transitions.create(['width', 'opacity'], {
    duration: theme.transitions.duration.shorter,
  }),
  whiteSpace: 'nowrap',
  ...(isCollapse && {
    opacity: 0,
    width: 0,
  }),
}))

const ListItemIconStyle = styled(ListItemIcon)({
  '& svg': { height: '100%', width: '100%' },
  alignItems: 'center',
  display: 'flex',
  height: DASHBOARD_NAVBAR_ICON_ITEM_SIZE,
  justifyContent: 'center',
  width: DASHBOARD_NAVBAR_ICON_ITEM_SIZE,
})

// ----------------------------------------------------------------------

const isExternalLink = (path: string) => path.includes('http')

export function NavItemRoot({
  item,
  isCollapse,
  open = false,
  active,
  onOpen,
}: NavItemProps) {
  const { title, path, icon, info, children } = item

  const renderContent = (
    <>
      {icon && <ListItemIconStyle>{icon}</ListItemIconStyle>}
      <ListItemTextStyle
        disableTypography
        primary={title}
        isCollapse={isCollapse}
      />
      {!isCollapse && (
        <>
          {info && info}
          {children && <ArrowIcon open={open} />}
        </>
      )}
    </>
  )

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeRoot={active}>
        {renderContent}
      </ListItemStyle>
    )
  }

  return isExternalLink(path) ? (
    <ListItemStyle href={path} target="_blank" rel="noopener">
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle to={path} activeRoot={active}>
      {renderContent}
    </ListItemStyle>
  )
}

// ----------------------------------------------------------------------

type NavItemSubProps = Omit<NavItemProps, 'isCollapse'>

export function NavItemSub({
  item,
  open = false,
  active,
  onOpen,
}: NavItemSubProps) {
  const { title, path, info, children } = item

  const renderContent = (
    <>
      <DotIcon active={active} />
      <ListItemText disableTypography primary={title} />
      {info && info}
      {children && <ArrowIcon open={open} />}
    </>
  )

  if (children) {
    return (
      <ListItemStyle onClick={onOpen} activeSub={active} subItem>
        {renderContent}
      </ListItemStyle>
    )
  }

  return isExternalLink(path) ? (
    <ListItemStyle href={path} target="_blank" rel="noopener" subItem>
      {renderContent}
    </ListItemStyle>
  ) : (
    <ListItemStyle to={path} activeSub={active} subItem>
      {renderContent}
    </ListItemStyle>
  )
}

// ----------------------------------------------------------------------

type DotIconProps = {
  active: boolean
}

export function DotIcon({ active }: DotIconProps) {
  return (
    <ListItemIconStyle>
      <Box
        component="span"
        sx={{
          bgcolor: 'text.disabled',
          borderRadius: '50%',
          height: 4,
          transition: (theme) =>
            theme.transitions.create('transform', {
              duration: theme.transitions.duration.shorter,
            }),
          width: 4,
          ...(active && {
            bgcolor: 'primary.main',
            transform: 'scale(2)',
          }),
        }}
      />
    </ListItemIconStyle>
  )
}

// ----------------------------------------------------------------------

type ArrowIconProps = {
  open: boolean
}

export function ArrowIcon({ open }: ArrowIconProps) {
  return (
    <Iconify
      icon={open ? 'eva:arrow-ios-downward-fill' : 'eva:arrow-ios-forward-fill'}
      sx={{ height: 16, ml: 1, width: 16 }}
    />
  )
}
