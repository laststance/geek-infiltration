import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'

import useOffSetTop from '../hooks/useOffSetTop'

import { HEADER_SCROLL_BLUR_PX } from './config'
import BrandMark from './sections/BrandMark'
import LoginButton from './sections/LoginButton'
import {
  LANDING,
  LANDING_FONT_SANS,
  LANDING_MAX_WIDTH_PX,
} from './sections/tokens'

/**
 * Sticky landing header: brand mark + `GEEK INFILTRATION` wordmark on the left, the
 * single `Login with GitHub` CTA on the right. Transparent over the hero, gaining a
 * blur + hairline border once the visitor scrolls. Marks the page `<header>` landmark.
 * @returns The public landing header that starts server-owned GitHub OAuth on login.
 * @example <MainHeader />
 */
export default function MainHeader() {
  // True once scrolled past the threshold — toggles the frosted header treatment.
  const isScrolled = useOffSetTop(HEADER_SCROLL_BLUR_PX)

  return (
    <AppBar
      component="header"
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isScrolled ? 'rgba(13, 17, 23, 0.82)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: `1px solid ${isScrolled ? LANDING.border : 'transparent'}`,
        boxShadow: 'none',
        transition: 'background-color .2s ease, border-color .2s ease',
      }}
    >
      <Container maxWidth={false} sx={{ maxWidth: LANDING_MAX_WIDTH_PX }}>
        <Toolbar
          disableGutters
          sx={{
            height: { xs: 64, md: 72 },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          {/* Brand: mark + wordmark */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
            }}
          >
            <BrandMark size={32} />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 0.75,
                fontFamily: LANDING_FONT_SANS,
                whiteSpace: 'nowrap',
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: LANDING.text,
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                }}
              >
                GEEK
              </Typography>
              <Typography
                component="span"
                sx={{
                  color: LANDING.textMuted,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  fontSize: { xs: '0.95rem', md: '1.05rem' },
                  display: { xs: 'none', sm: 'inline' },
                }}
              >
                INFILTRATION
              </Typography>
            </Box>
          </Box>

          <LoginButton tone="neutral" size="medium" />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
