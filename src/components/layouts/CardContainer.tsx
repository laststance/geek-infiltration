import { Card } from '@nextui-org/react'
import React, { memo } from 'react'
import type { PropsWithChildren } from 'react'

const CardContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Card as="section" css={{ borderRadius: 0, h: '100%' }}>
    {children}
  </Card>
))
CardContainer.displayName = 'Sideber.CardContainer'

export default CardContainer
