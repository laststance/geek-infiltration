import { Divider, Stack } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import useModalControl from '../../../hooks/useModalControl'

import AccountMenu from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

const SideBarContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Stack
    sx={{ border: 0, borderRadius: 0, h: '100vh', margin: 0, padding: 0 }}
    direction="column"
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
      <AccountMenu />
    </SideBarContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
