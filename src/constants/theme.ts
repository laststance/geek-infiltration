import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

import { customShadows } from '../LandingPage/shadows'

export const theme = createTheme({
  components: {},
  customShadows: customShadows.dark,
  palette: {
    mode: 'dark',
  },
} as ThemeOptions)
