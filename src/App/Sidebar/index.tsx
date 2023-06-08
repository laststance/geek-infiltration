import { Divider, Stack } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'

import UserMenuButton from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

const SideBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Stack
    sx={{
      border: 0,
      borderRadius: 0,
      margin: 0,
      maxWidth: '70px',
      minHeight: '100%',
      minWidth: '70px',
      padding: 0,
    }}
    direction="column-reverse"
    gap={0}
    component="section"
  >
    {children}
  </Stack>
))
SideBarContainer.displayName = 'Sidebar.Container'

const Sidebar = memo(() => {
  const { isModalVisible, openModal, closeModal } = useModalControl()

  return (
    <SideBarContainer>
      <OpenSubscribeFormModalButton openModal={openModal} />
      <SubscribeFormModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <Divider />
      <UserMenuButton />
    </SideBarContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
