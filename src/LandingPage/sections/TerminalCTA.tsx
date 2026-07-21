import { Box, Typography } from '@mui/material'

import LoginButton from './LoginButton'
import Reveal from './Reveal'
import { LANDING, LANDING_FONT_MONO, LANDING_MAX_WIDTH_PX } from './tokens'

/**
 * Terminal-styled closing CTA band: a green prompt, the headline question
 * "Ready to infiltrate the signal?", a mock login command, and the final
 * Login with GitHub button. Last content block before the footer.
 * @returns The closing call-to-action section.
 * @example <TerminalCTA />
 */
export default function TerminalCTA() {
  return (
    <Box
      component="section"
      aria-label="Get started"
      sx={{
        px: 3,
        py: { xs: 4, md: 6 },
        maxWidth: LANDING_MAX_WIDTH_PX,
        mx: 'auto',
      }}
    >
      <Reveal
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          bgcolor: LANDING.bgDeep,
          border: `1px solid ${LANDING.greenBorder}`,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1 }}>
            {/* Green terminal prompt glyph */}
            <Box
              aria-hidden
              sx={{
                fontFamily: LANDING_FONT_MONO,
                color: LANDING.green,
                fontWeight: 700,
              }}
            >
              {'>_'}
            </Box>
            <Typography
              component="h2"
              sx={{
                color: LANDING.text,
                fontWeight: 700,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
              }}
            >
              Ready to infiltrate the signal?
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: LANDING_FONT_MONO,
              color: LANDING.green,
              fontSize: { xs: '0.85rem', md: '0.95rem' },
              pl: { xs: 0, md: 3.5 },
            }}
          >
            geek-infiltration login --provider github
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <LoginButton tone="accent" />
        </Box>
      </Reveal>
    </Box>
  )
}
