// Side-effect: register self-hosted Geist fonts before the landing renders.
import './sections/fonts'

import { Box } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useMemo } from 'react'

import Home from './HomeRootComponent'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'
import { LANDING, LANDING_FONT_SANS, landingCssVars } from './sections/tokens'

/**
 * Public landing entry (refine-1): wraps header + main + footer in a dark,
 * Geist-defaulted MUI theme scoped to the landing, so marketing type and colors are
 * locked regardless of the app's global theme. Mounted for signed-out visitors;
 * the route loader redirects authenticated users to /app.
 * @returns The full signed-out landing page.
 * @example <LandingPage />
 */
const LandingPage: React.FC = () => {
  // Landing-only theme: dark palette + Geist as the default font family. Explicit
  // Geist Mono spots (eyebrow, badges, terminal CTA) still override via their sx.
  const landingTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'dark',
          background: { default: LANDING.bg, paper: LANDING.panel },
        },
        typography: { fontFamily: LANDING_FONT_SANS },
      }),
    [],
  )

  return (
    <ThemeProvider theme={landingTheme}>
      <Box
        sx={{
          ...landingCssVars,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          bgcolor: LANDING.bg,
          color: LANDING.text,
        }}
      >
        <MainHeader />
        <Home />
        {/* Push the footer to the bottom when content is shorter than the viewport */}
        <Box sx={{ flexGrow: 1 }} />
        <MainFooter />
      </Box>
    </ThemeProvider>
  )
}

export default LandingPage
