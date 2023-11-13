import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles/createTheme'

import { customShadows } from '../LandingPage/shadows'

import type { themeVeiwer } from './themeVeiwer'
// @ts-expect-error helpfull for auto complete
export const theme: typeof themeVeiwer = createTheme({
  components: {},
  customShadows: customShadows.dark,
  palette: {
    mode: 'dark',
  },
} as ThemeOptions)
