import { Backdrop, CircularProgress } from '@mui/material'

/**
 * Shows a blocking loading state while route modules or auth callbacks resolve.
 * @returns Full-screen progress indicator.
 * @example
 * <FullScreenSpinner />
 */
export function FullScreenSpinner() {
  return (
    <Backdrop open data-testid="full-screen-spinner" aria-label="Loading">
      <CircularProgress />
    </Backdrop>
  )
}
