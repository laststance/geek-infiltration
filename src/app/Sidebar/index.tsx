import NewReleasesIcon from '@mui/icons-material/NewReleases'
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline'
import { Stack, Tooltip, alpha, styled } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'
import { NavLink } from 'react-router'

import useModalControl from '../../hooks/useModalControl'

import UserMenuButton from './AccountMenu'
import SubscribeFormModal from './SubscribeFormModal'
import SubscribeFormModalButton from './SubscribeFormModalButton'

const SIDEBAR_WIDTH_PX = 70
const SIDEBAR_BUTTON_SIZE_PX = 46

const NAVIGATION_ITEMS = [
  {
    icon: ViewTimelineIcon,
    label: 'Timeline',
    testId: 'sidebar-timeline-link',
    to: '/app',
  },
  {
    icon: NewReleasesIcon,
    label: 'Release Feed',
    testId: 'sidebar-release-feed-link',
    to: '/releases',
  },
] as const

const SidebarNavigationLink = styled(NavLink)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.secondary,
  display: 'inline-flex',
  height: SIDEBAR_BUTTON_SIZE_PX,
  justifyContent: 'center',
  minHeight: SIDEBAR_BUTTON_SIZE_PX,
  minWidth: SIDEBAR_BUTTON_SIZE_PX,
  textDecoration: 'none',
  transition: theme.transitions.create(['background-color', 'color'], {
    duration: theme.transitions.duration.shortest,
  }),
  width: SIDEBAR_BUTTON_SIZE_PX,
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.18),
    color: theme.palette.primary.main,
  },
  '&:focus-visible': {
    outline: `2px solid ${theme.palette.primary.main}`,
    outlineOffset: 2,
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    color: theme.palette.primary.main,
  },
}))

/**
 * Renders authenticated view links so Sidebar controls URL state and active view styling.
 * @returns The compact Timeline and Release Feed navigation controls.
 * @example
 * <SidebarNavigation />
 */
const SidebarNavigation = memo(() => {
  return (
    <Stack
      aria-label="Authenticated views"
      component="nav"
      direction="column"
      spacing={1}
    >
      {NAVIGATION_ITEMS.map((item) => {
        const Icon = item.icon

        return (
          <Tooltip key={item.to} title={item.label} placement="right">
            <SidebarNavigationLink
              aria-label={item.label}
              data-testid={item.testId}
              end
              to={item.to}
            >
              <Icon fontSize="small" />
            </SidebarNavigationLink>
          </Tooltip>
        )
      })}
    </Stack>
  )
})
SidebarNavigation.displayName = 'Sidebar.Navigation'

const SideBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Stack
    direction="column"
    aria-label="Main navigation"
    component="aside"
    data-testid="sidebar"
    sx={{
      alignItems: 'center',
      border: 0,
      justifyContent: 'space-between',
      margin: 0,
      maxWidth: SIDEBAR_WIDTH_PX,
      minHeight: '100%',
      minWidth: SIDEBAR_WIDTH_PX,
      padding: '8px 0',
    }}
  >
    {children}
  </Stack>
))
SideBarContainer.displayName = 'Sidebar.Container'

const Sidebar = memo(() => {
  const { closeModal, isModalVisible, openModal } = useModalControl()

  return (
    <>
      <SubscribeFormModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <SideBarContainer>
        <SidebarNavigation />
        <Stack
          aria-label="Account actions"
          direction="column"
          spacing={3}
          sx={{ alignItems: 'center' }}
        >
          <SubscribeFormModalButton openModal={openModal} />
          <UserMenuButton />
        </Stack>
      </SideBarContainer>
    </>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
