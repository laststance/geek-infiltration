import { Box, Typography } from '@mui/material'

import LoginButton from './LoginButton'
import Reveal from './Reveal'
import { LANDING, LANDING_FONT_MONO, LANDING_MAX_WIDTH_PX } from './tokens'

/**
 * Centered hero: mono eyebrow, the single strongest anchor headline
 * ("Follow the work, not the feed."), one-line subtext, and the one hero CTA.
 * Carries the page's only <h1>. Rendered first inside the landing main content.
 * @returns The introductory hero section with a same-origin GitHub login CTA.
 * @example <Hero />
 */
export default function Hero() {
  return (
    <Box
      component="section"
      aria-label="Introduction"
      sx={{
        textAlign: 'center',
        px: 3,
        pt: { xs: 6, md: 10 },
        pb: { xs: 5, md: 7 },
        maxWidth: LANDING_MAX_WIDTH_PX,
        mx: 'auto',
      }}
    >
      {/* Mono eyebrow — sets the "calm, GitHub-native" tone above the headline */}
      {/* immediate: hero is above-the-fold, so fire on mount (never gate the CTA
          on an IntersectionObserver — see Reveal). */}
      <Reveal immediate>
        <Typography
          sx={{
            fontFamily: LANDING_FONT_MONO,
            color: LANDING.green,
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            mb: 2.5,
          }}
        >
          A calmer way to track GitHub activity
        </Typography>
      </Reveal>

      {/* The single visual anchor of the whole page */}
      <Reveal immediate delay={0.06}>
        <Typography
          component="h1"
          sx={{
            color: LANDING.text,
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            mb: 2.5,
          }}
        >
          Follow the work, not the feed.
        </Typography>
      </Reveal>

      {/* One-line promise */}
      <Reveal immediate delay={0.12}>
        <Typography
          sx={{
            color: LANDING.textSubtle,
            fontSize: { xs: '1rem', md: '1.2rem' },
            lineHeight: 1.6,
            maxWidth: 600,
            mx: 'auto',
            mb: 4,
          }}
        >
          Track the issues and pull requests that matter, straight from the
          people you trust — no algorithmic feed in between.
        </Typography>
      </Reveal>

      <Reveal immediate delay={0.18}>
        <LoginButton tone="accent" />
      </Reveal>
    </Box>
  )
}
