import { Divider } from '@nextui-org/react'
import React, { memo } from 'react'

import useModalHandlers from '../../hooks/useModalHandlers'
import CardBody from '../layouts/CardBody'
import CardContainer from '../layouts/CardContainer'

import AccountMenu from './AccountMenu'
import OpenSubscribeFormModalButton from './OpenSubscribeFormModalButton'
import SubscribeFormModal from './SubscribeFormModal'

const Sidebar = memo(() => {
  const { isVisible, onOpen, onClose } = useModalHandlers()

  return (
    <CardContainer>
      <CardBody>
        <OpenSubscribeFormModalButton onOpen={onOpen} />
        <SubscribeFormModal isVisible={isVisible} onClose={onClose} />
      </CardBody>
      <Divider />
      <AccountMenu />
    </CardContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
