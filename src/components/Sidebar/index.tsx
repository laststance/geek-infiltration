import { Divider } from '@mui/material'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'
import CardContainer from '../layouts/CardContainer'

import AccountMenu from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

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
