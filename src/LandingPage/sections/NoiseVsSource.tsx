import { Box, Typography } from '@mui/material'

import Iconify from '../Iconify'

import Reveal from './Reveal'
import {
  LANDING,
  LANDING_FONT_MONO,
  LANDING_MAX_WIDTH_PX,
  LANDING_VISUALLY_HIDDEN,
} from './tokens'

const NOISE_POINTS = [
  'Endless scroll',
  'Algorithmic distractions',
  'Out of your control',
] as const
const SOURCE_POINTS = [
  'Signal over noise',
  'Work from people you trust',
  'In control of your attention',
] as const

/**
 * Renders one titled comparison column (noise or source) with an icon-led point list.
 * @param tone - 'noise' paints red + ✗ marks, 'source' paints green + ✓ marks.
 * @param title - column heading text, e.g. "THE NOISE".
 * @param points - short bullet lines.
 * @returns A bordered panel used on one side of the VS band.
 */
function ComparisonColumn({
  tone,
  title,
  points,
}: {
  tone: 'noise' | 'source'
  title: string
  points: readonly string[]
}) {
  const isNoise = tone === 'noise'
  const accent = isNoise ? LANDING.danger : LANDING.green

  return (
    <Box
      sx={{
        flex: 1,
        p: 3,
        borderRadius: 2,
        bgcolor: LANDING.panel,
        border: `1px solid ${isNoise ? 'rgba(248, 81, 73, 0.35)' : LANDING.greenBorder}`,
      }}
    >
      <Typography
        component="h3"
        sx={{
          fontFamily: LANDING_FONT_MONO,
          color: accent,
          fontWeight: 600,
          letterSpacing: '0.12em',
          fontSize: '0.9rem',
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Box
        component="ul"
        sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1.25 }}
      >
        {points.map((point) => (
          <Box
            component="li"
            key={point}
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}
          >
            <Iconify
              icon={isNoise ? 'octicon:x-16' : 'octicon:check-16'}
              sx={{ width: 18, height: 18, color: accent, flexShrink: 0 }}
            />
            <Typography sx={{ color: LANDING.textSubtle, fontSize: '0.98rem' }}>
              {point}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

/**
 * "Noise vs source" band contrasting an algorithmic feed (red) against reading the
 * primary source (green), with a center VS badge. Reinforces the core concept below
 * the feature cards. Stacks vertically on mobile with the badge between the panels.
 * @returns The comparison section.
 * @example <NoiseVsSource />
 */
export default function NoiseVsSource() {
  return (
    <Box
      component="section"
      aria-labelledby="noise-vs-source-heading"
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
        id="noise-vs-source-heading"
        sx={LANDING_VISUALLY_HIDDEN}
      >
        Why Geek Infiltration
      </Typography>
      <Reveal
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: { xs: 2, md: 0 },
        }}
      >
        <ComparisonColumn
          tone="noise"
          title="THE NOISE"
          points={NOISE_POINTS}
        />

        {/* Center VS badge — sits between the panels on desktop, between rows on mobile */}
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            px: { md: 3 },
            py: { xs: 1, md: 0 },
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: LANDING.bg,
              border: `1px solid ${LANDING.border}`,
              fontFamily: LANDING_FONT_MONO,
              fontWeight: 700,
              color: LANDING.textSubtle,
              fontSize: '0.95rem',
            }}
          >
            VS
          </Box>
        </Box>

        <ComparisonColumn
          tone="source"
          title="THE SOURCE"
          points={SOURCE_POINTS}
        />
      </Reveal>
    </Box>
  )
}
