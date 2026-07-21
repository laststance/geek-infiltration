import { Box, Link, Typography } from '@mui/material'

import { LANDING } from './sections/tokens'

/**
 * Minimal landing footer: a centered, muted copyright line linking back to
 * Laststance.io. Marks the page `<footer>` landmark below the closing CTA.
 * @returns The landing footer.
 * @example <MainFooter />
 */
export default function MainFooter() {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        px: 3,
        py: 4,
        borderTop: `1px solid ${LANDING.border}`,
      }}
    >
      <Typography sx={{ color: LANDING.textMuted, fontSize: '0.85rem' }}>
        © {new Date().getFullYear()}{' '}
        <Link
          href="https://laststance.io/"
          target="_blank"
          rel="noreferrer"
          sx={{
            color: LANDING.textMuted,
            textUnderlineOffset: 3,
            transition: 'color .18s ease',
            '&:hover': { color: LANDING.text },
            '&:focus-visible': {
              outline: `2px solid ${LANDING.greenBorder}`,
              outlineOffset: 2,
              borderRadius: 2,
            },
          }}
        >
          Laststance.io
        </Link>
      </Typography>
    </Box>
  )
}
