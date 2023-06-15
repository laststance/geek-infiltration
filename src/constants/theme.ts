import { createTheme } from '@mui/material/styles'

import { customShadows } from '../LandingPage/shadows'

export const theme = createTheme({
  customShadows: customShadows.dark,
  // @ts-expect-error @TODO
  palette: {
    mode: 'dark',
  },
})
