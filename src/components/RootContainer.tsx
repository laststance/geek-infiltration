import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

const RootContainer: React.FC<PropsWithChildren> = memo(({ children }) => (
  <div style={{ display: 'flex', height: '100%', width: '100%' }}>
    {children}
  </div>
))
RootContainer.displayName = 'RootContainer'
export default RootContainer
