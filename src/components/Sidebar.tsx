import { Card, Avatar, Divider, Row } from '@nextui-org/react'
import React, { memo } from 'react'

import PlusButton from './PlusButton'

const Sidebar = () => {
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
        <PlusButton />
      </Card.Body>
      <Divider />
      <Card.Footer blur as="footer" css={{ p: '20px 10px' }}>
        <Avatar src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4" />
      </Card.Footer>
    </Card>
  )
}

export default memo(Sidebar)
