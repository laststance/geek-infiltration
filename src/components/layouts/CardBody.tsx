import { Card } from '@nextui-org/react'
import React, { memo } from 'react'
import type { PropsWithChildren } from 'react'

const CardBody: React.FC<PropsWithChildren> = memo(({ children }) => (
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
    {children}
  </Card.Body>
))
CardBody.displayName = 'Sidebar.CardBody'

export default CardBody
