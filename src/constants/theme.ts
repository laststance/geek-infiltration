import { createTheme } from '@mui/material/styles'
import type { ThemeOptions } from '@mui/material/styles'

import { customShadows } from '../LandingPage/shadows'

declare module '@mui/material/styles' {
  interface Shape {
    sm: number
    md: number
    lg: number
  }
  interface ShapeOptions {
    sm?: number
    md?: number
    lg?: number
  }
}

const defaultTheme: ThemeOptions = {
  components: {},
  customShadows: customShadows.dark,
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
    sm: 4,
    md: 8,
    lg: 12,
  },
}
export const theme = createTheme(defaultTheme)
