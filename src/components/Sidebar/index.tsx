import { Divider } from '@nextui-org/react'
import React, { memo } from 'react'

import useModalHandlers from '../../hooks/useModalHandlers'

import AccountMenu from './AccountMenu'
import AddButton from './AddButtton'
import CardBody from './CardBody'
import CardContainer from './CardContainer'
import SubscribeFormModal from './SubscribeFormModal'

const Sidebar = memo(() => {
  const { isVisible, onOpen, onClose } = useModalHandlers()

  return (
    <CardContainer>
      <CardBody>
        <AddButton onOpen={onOpen} />
        <SubscribeFormModal isVisible={isVisible} onClose={onClose} />
      </CardBody>
      <Divider />
      <AccountMenu />
    </CardContainer>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
