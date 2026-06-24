import { Stack } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'

import UserMenuButton from './AccountMenu'
import SubscribeFormModal from './SubscribeFormModal'
import SubscribeFormModalButton from './SubscribeFormModalButton'

const SideBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Stack
    direction="column-reverse"
    aria-label="Main navigation"
    component="aside"
    data-testid="sidebar"
    sx={{
      gap: 3,
      alignItems: 'center',
      border: 0,
      margin: 0,
      maxWidth: '70px',
      minHeight: '100%',
      minWidth: '70px',
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
        <UserMenuButton />
        <SubscribeFormModalButton openModal={openModal} />
      </SideBarContainer>
    </>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
