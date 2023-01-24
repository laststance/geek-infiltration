import type { PropsWithChildren } from 'react'
import React, { memo } from 'react'

const SidebarSection: React.FC<PropsWithChildren> = memo(({ children }) => (
  <section style={{ height: '100%', width: '60px' }}>{children}</section>
))
SidebarSection.displayName = 'SidebarSection'
export default SidebarSection
