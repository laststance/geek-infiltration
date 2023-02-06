import { Divider } from '@nextui-org/react'
import React, { memo } from 'react'

import useModalControl from '../../hooks/useModalControl'
import CardBody from '../layouts/CardBody'
import CardContainer from '../layouts/CardContainer'

import AccountMenu from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

const Sidebar = memo(() => {
  const { isModalVisible, openModal, closeModal } = useModalControl()

  return (
    <CardContainer>
      <CardBody>
        <OpenSubscribeFormModalButton openModal={openModal} />
        <SubscribeFormModal
          isModalVisible={isModalVisible}
          closeModal={closeModal}
        />
      </CardBody>
      <Divider />
      <AccountMenu />
    </CardContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
