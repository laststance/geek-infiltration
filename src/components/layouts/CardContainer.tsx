import { Card } from '@mui/material'
import React, { memo } from 'react'
import type { PropsWithChildren } from 'react'

const CardContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <Card sx={{ borderRadius: 0, h: '100%' }}>{children}</Card>
))
CardContainer.displayName = 'Sideber.CardContainer'

export default CardContainer
