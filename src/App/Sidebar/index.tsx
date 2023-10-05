import { Stack } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'

import UserMenuButton from './AccountMenu'
import SubscribeFormModal from './SubscribeFormModal'
import SubscribeFormModalButton from './SubscribeFormModalButton'

const SideBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Stack
    sx={{
      alignItems: 'center',
      border: 0,
      margin: 0,
      maxWidth: '70px',
      minHeight: '100%',
      minWidth: '70px',
      padding: '8px 0',
    }}
    direction="column-reverse"
    gap={3}
    component="section"
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
