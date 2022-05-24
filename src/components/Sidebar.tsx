import { Card, Avatar } from '@nextui-org/react'
import React, { memo } from 'react'

const Sidebar = () => {
  return (
    <Card as="section" css={{ borderRadius: 0, h: '100%', w: '100%' }}>
      <Card.Footer blur as="footer" css={{ p: '10px' }}>
        <Avatar src="https://avatars.githubusercontent.com/u/5501268?s=32&v=4" />
      </Card.Footer>
    </Card>
  )
}

export default memo(Sidebar)
