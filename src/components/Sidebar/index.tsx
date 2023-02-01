import { Card, Divider } from '@nextui-org/react'
import React, { memo } from 'react'

import useModalHandlers from '../../hooks/useModalHandlers'

import AccountMenu from './AccountMenu'
import AddButton from './AddButtton'
import SubscribeModal from './SubscribeModal'

const Sidebar = memo(() => {
  const { isVisible, onOpen, onClose } = useModalHandlers()

  return (
    <Card as="section" css={{ borderRadius: 0, h: '100%' }}>
      <Card.Body
        as="aside"
        css={{
          ai: 'center',
          d: 'flex',
          fd: 'colmun',
          jc: 'flex-end',
          p: '20px 10px',
        }}
      >
        <AddButton onOpen={onOpen} />
        <SubscribeModal isVisible={isVisible} onClose={onClose} />
      </Card.Body>
      <Divider />
      <AccountMenu />
    </Card>
  )
})
Sidebar.displayName = 'Sidebar'
export default Sidebar
