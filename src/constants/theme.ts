import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles/createTheme'

import { customShadows } from '../LandingPage/shadows'

import type { themeVeiwer } from './themeVeiwer'

declare module '@mui/material' {
  interface Shape {
    sm: number
    md: number
    lg: number
  }
}

const defaultTheme: ThemeOptions = {
  components: {},
  customShadows: customShadows.dark,
  // @ts-expect-error should allow mode value
  palette: {
    mode: 'dark',
  },
  unstable_sxConfig: {
    // You can now use the borderRadius key in sx
    // by providing direct values from the palette
    borderRadius: {
      themeKey: 'shape',
    },
  },
  shape: {
    // @ts-expect-error TODO
    sm: 4,
    md: 8,
    lg: 12,
  },
}
// @ts-expect-error helpfull for auto complete
export const theme: typeof themeVeiwer = createTheme(defaultTheme)
