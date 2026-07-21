import { Box, Typography } from '@mui/material'

import Iconify from '../Iconify'

import Reveal from './Reveal'
import {
  LANDING,
  LANDING_MAX_WIDTH_PX,
  LANDING_VISUALLY_HIDDEN,
} from './tokens'

/** One feature card's content (icon + heading + supporting copy). */
interface Feature {
  icon: string
  title: string
  body: string
}

const FEATURES: readonly Feature[] = [
  {
    icon: 'octicon:clock-16',
    title: 'Timeline aggregation',
    body: 'All activity from your favorite developers, repos, and organizations in one calm timeline.',
  },
  {
    icon: 'octicon:bookmark-16',
    title: 'Subscriptions',
    body: 'Subscribe to people, repos, or orgs. Get updates on the work you actually care about.',
  },
  {
    icon: 'octicon:lock-16',
    title: 'GitHub OAuth login',
    body: 'Secure GitHub OAuth. Your data stays private and is never sold.',
  },
] as const

/**
 * Three-up feature panels (Timeline aggregation / Subscriptions / GitHub OAuth login)
 * explaining what the product does, below the hero board. Collapses 3-col → 1-col on
 * mobile. Each card title is an <h3>; no in-card buttons (single CTA lives elsewhere).
 * @returns The "what you get" feature section.
 * @example <FeatureCards />
 */
export default function FeatureCards() {
  return (
    <Box
      component="section"
      aria-labelledby="feature-cards-heading"
      sx={{
        px: 3,
        py: { xs: 4, md: 6 },
        maxWidth: LANDING_MAX_WIDTH_PX,
        mx: 'auto',
      }}
    >
      {/* SR-only section heading — restores a valid h1→h2→h3 outline (visual unchanged) */}
      <Typography
        component="h2"
        id="feature-cards-heading"
        sx={LANDING_VISUALLY_HIDDEN}
      >
        What you get
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {FEATURES.map((feature, index) => (
          <Reveal
            key={feature.title}
            delay={index * 0.08}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: LANDING.panel,
              border: `1px solid ${LANDING.border}`,
              height: '100%',
            }}
          >
            {/* Green outline icon badge */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: 'grid',
                placeItems: 'center',
                border: `1px solid ${LANDING.greenBorder}`,
                bgcolor: LANDING.greenSoft,
                mb: 2,
              }}
            >
              <Iconify
                icon={feature.icon}
                sx={{ width: 22, height: 22, color: LANDING.green }}
              />
            </Box>
            <Typography
              component="h3"
              sx={{
                color: LANDING.text,
                fontWeight: 600,
                fontSize: '1.15rem',
                mb: 1,
              }}
            >
              {feature.title}
            </Typography>
            <Typography
              sx={{
                color: LANDING.textMuted,
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              {feature.body}
            </Typography>
          </Reveal>
        ))}
      </Box>
    </Box>
  )
}
