import { Container } from '@mui/material'
import type { ReactNode } from 'react'
import { memo } from 'react'

import Sidebar from './Sidebar'

type AppShellProps = {
  children: ReactNode
}

/**
 * Keeps the authenticated Sidebar mounted while route outlets swap views.
 * @param children - Authenticated route content rendered to the right of the Sidebar.
 * @returns The full-height authenticated application shell.
 * @example
 * <AppShell><TimelineContainer /></AppShell>
 */
const AppShell = memo(({ children }: AppShellProps) => {
  return (
    <Container
      fixed
      disableGutters
      component="main"
      data-testid="app-container"
      sx={{
        display: 'flex',
        maxHeight: '100vh',
        minHeight: '100vh',
        minWidth: '100%',
        overflowY: 'hidden',
      }}
    >
      <Sidebar />
      {children}
    </Container>
  )
})
AppShell.displayName = 'AppShell'

export default AppShell
