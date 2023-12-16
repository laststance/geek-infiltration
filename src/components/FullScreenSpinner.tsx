import { Backdrop, CircularProgress } from '@mui/material'

export function FullScreenSpinner() {
  return (
    <Backdrop open>
      <CircularProgress />
    </Backdrop>
  )
}
