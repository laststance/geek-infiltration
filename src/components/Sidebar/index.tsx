import { Divider, Card } from '@mui/material'
import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'

import AccountMenu from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

const CardContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Card sx={{ borderRadius: 0, h: '100%' }}>{children}</Card>
))
CardContainer.displayName = 'Sidebar.CardContainer'

const Sidebar = memo(() => {
  const { isModalVisible, openModal, closeModal } = useModalControl()

  return (
    <CardContainer>
      <OpenSubscribeFormModalButton openModal={openModal} />
      <SubscribeFormModal
        isModalVisible={isModalVisible}
        closeModal={closeModal}
      />
      <Divider />
      <AccountMenu />
    </CardContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
