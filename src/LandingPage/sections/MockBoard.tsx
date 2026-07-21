import { Avatar, Box, Typography } from '@mui/material'
import { useReducedMotion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { UIEvent } from 'react'

import { BOARD_GLOW_DURATION_S } from '../config'
import Iconify from '../Iconify'

import type { BoardColumn } from './boardData'
import { BOARD_COLUMNS } from './boardData'
import Reveal from './Reveal'
import { LANDING, LANDING_FONT_MONO, LANDING_MAX_WIDTH_PX } from './tokens'

const TRAFFIC_LIGHTS = ['#ff5f57', '#febc2e', '#28c840'] as const

/**
 * Renders one developer's activity column inside the mock board (repo, PR/Issue
 * badge, title, commenter, and a short comment). Focusable so the mobile swipe
 * strip is keyboard-reachable.
 * @param column - the static activity item to display.
 * @param isLast - true for the final column (drops the divider border).
 * @returns A single board column card.
 */
function BoardColumnCard({
  column,
  isLast,
}: {
  column: BoardColumn
  isLast: boolean
}) {
  const isPullRequest = column.kind === 'pr'
  const badgeColor = isPullRequest ? LANDING.green : LANDING.purple

  return (
    <Box
      role="group"
      aria-label={`${column.owner}: ${column.reference} in ${column.repo}`}
      tabIndex={0}
      sx={{
        // Mobile: wide snap targets that reveal a peek of the next column.
        minWidth: { xs: '82%', md: 0 },
        scrollSnapAlign: { xs: 'center', md: 'none' },
        p: 2,
        borderRight: isLast ? 'none' : `1px solid ${LANDING.border}`,
        '&:focus-visible': {
          outline: 'none',
          boxShadow: `inset 0 0 0 2px ${LANDING.greenBorder}`,
          borderRadius: 1,
        },
      }}
    >
      {/* Column header: owner + (decorative) View all */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Iconify
          icon="octicon:mark-github-16"
          sx={{ width: 18, height: 18, color: LANDING.text }}
        />
        <Typography
          sx={{ color: LANDING.text, fontWeight: 600, fontSize: '0.95rem' }}
        >
          {column.owner}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography
          aria-hidden
          sx={{ color: LANDING.green, fontSize: '0.78rem', fontWeight: 500 }}
        >
          View all →
        </Typography>
      </Box>

      {/* Repo + visibility */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
        <Iconify
          icon="octicon:repo-16"
          sx={{ width: 14, height: 14, color: LANDING.textMuted }}
        />
        <Typography sx={{ color: LANDING.textMuted, fontSize: '0.8rem' }}>
          {column.repo}
        </Typography>
        <Box
          sx={{
            px: 0.75,
            py: 0.1,
            borderRadius: 5,
            border: `1px solid ${LANDING.border}`,
            color: LANDING.textMuted,
            fontSize: '0.68rem',
          }}
        >
          Public
        </Box>
      </Box>

      {/* PR / Issue badge */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
        <Iconify
          icon={
            isPullRequest
              ? 'octicon:git-pull-request-16'
              : 'octicon:issue-opened-16'
          }
          sx={{ width: 15, height: 15, color: badgeColor }}
        />
        <Typography
          sx={{
            fontFamily: LANDING_FONT_MONO,
            color: badgeColor,
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          {column.reference}
        </Typography>
      </Box>

      {/* Title */}
      <Typography
        sx={{
          color: LANDING.textSubtle,
          fontSize: '0.9rem',
          lineHeight: 1.4,
          fontWeight: 500,
          mb: 1.5,
        }}
      >
        {column.title}
      </Typography>

      {/* Commenter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <Avatar
          src={`https://github.com/${column.commenter}.png?size=48`}
          alt=""
          slotProps={{ img: { loading: 'lazy' } }}
          sx={{
            width: 24,
            height: 24,
            fontSize: '0.7rem',
            bgcolor: LANDING.panelRaised,
          }}
        >
          {column.commenter.charAt(0).toUpperCase()}
        </Avatar>
        <Typography sx={{ color: LANDING.textMuted, fontSize: '0.8rem' }}>
          @{column.commenter}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Typography sx={{ color: LANDING.textMuted, fontSize: '0.72rem' }}>
          {column.timeAgo}
        </Typography>
      </Box>

      {/* Comment bubble */}
      <Box
        sx={{
          p: 1.25,
          borderRadius: 1.5,
          bgcolor: LANDING.bgDeep,
          border: `1px solid ${LANDING.border}`,
        }}
      >
        <Typography
          sx={{
            color: LANDING.textSubtle,
            fontSize: '0.82rem',
            lineHeight: 1.5,
          }}
        >
          {column.comment}
        </Typography>
      </Box>
    </Box>
  )
}

/**
 * The hero product board: a mock browser window framing four developer activity
 * columns with a soft pulsing green glow. Idealized static marketing content (not a
 * live screenshot) so it never goes stale as the real UI evolves. On mobile the
 * columns become a scroll-snapping swipe strip with page dots; columns stay
 * keyboard-focusable. Glow pauses under prefers-reduced-motion.
 * @returns The hero mock board section.
 * @example <MockBoard />
 */
export default function MockBoard() {
  const prefersReducedMotion = useReducedMotion()
  const [activeColumn, setActiveColumn] = useState(0)
  const stripRef = useRef<HTMLDivElement>(null)

  // Keep the active page dot in sync as the user swipes the mobile column strip.
  const handleStripScroll = (event: UIEvent<HTMLDivElement>) => {
    const strip = event.currentTarget
    const columnWidth = strip.scrollWidth / BOARD_COLUMNS.length
    const nextIndex = Math.round(strip.scrollLeft / columnWidth)
    setActiveColumn(Math.min(Math.max(nextIndex, 0), BOARD_COLUMNS.length - 1))
  }

  // Scroll a specific column into view when its page dot is activated (click/Enter).
  const scrollToColumn = (index: number) => {
    const strip = stripRef.current
    const column = strip?.children[index]
    if (column instanceof HTMLElement) {
      column.scrollIntoView({
        // Honor prefers-reduced-motion: jump instantly instead of animating.
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  return (
    <Box
      component="section"
      aria-label="Product preview"
      sx={{
        px: 3,
        pb: { xs: 4, md: 6 },
        maxWidth: LANDING_MAX_WIDTH_PX,
        mx: 'auto',
      }}
    >
      <Reveal sx={{ position: 'relative' }}>
        {/* Green glow: a static max-glow box-shadow whose OPACITY pulses. Animating
            opacity composites on the GPU, so the largest element on the page no
            longer repaints every frame (as animating box-shadow did). Sits as a
            sibling BEHIND the frame so the frame's overflow:hidden can't clip it. */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            inset: 0,
            borderRadius: 2.5,
            pointerEvents: 'none',
            boxShadow:
              '0 0 0 1px rgba(57, 211, 83, 0.34), 0 12px 80px -16px rgba(57, 211, 83, 0.6)',
            '@keyframes giBoardGlowPulse': {
              '0%, 100%': { opacity: 0.6 },
              '50%': { opacity: 1 },
            },
            // Reduced motion: hold a steady mid glow instead of pulsing.
            opacity: prefersReducedMotion ? 0.7 : undefined,
            animation: prefersReducedMotion
              ? 'none'
              : `giBoardGlowPulse ${BOARD_GLOW_DURATION_S}s ease-in-out infinite`,
          }}
        />
        {/* Browser window frame (clips its own content; paints above the glow) */}
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2.5,
            border: `1px solid ${LANDING.border}`,
            bgcolor: LANDING.panel,
            overflow: 'hidden',
          }}
        >
          {/* Chrome bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2,
              py: 1.25,
              borderBottom: `1px solid ${LANDING.border}`,
              bgcolor: LANDING.bgDeep,
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.75 }}>
              {TRAFFIC_LIGHTS.map((color) => (
                <Box
                  key={color}
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: '50%',
                    bgcolor: color,
                  }}
                />
              ))}
            </Box>
            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                gap: 0.5,
                color: LANDING.textMuted,
              }}
            >
              <Iconify
                icon="octicon:chevron-left-16"
                sx={{ width: 16, height: 16 }}
              />
              <Iconify
                icon="octicon:chevron-right-16"
                sx={{ width: 16, height: 16 }}
              />
            </Box>
            {/* URL pill */}
            <Box
              sx={{
                flexGrow: 1,
                maxWidth: 420,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
                px: 1.5,
                py: 0.5,
                borderRadius: 1.5,
                bgcolor: LANDING.bg,
                border: `1px solid ${LANDING.border}`,
              }}
            >
              <Iconify
                icon="octicon:lock-16"
                sx={{ width: 12, height: 12, color: LANDING.textMuted }}
              />
              <Typography
                sx={{
                  fontFamily: LANDING_FONT_MONO,
                  color: LANDING.textMuted,
                  fontSize: '0.75rem',
                }}
              >
                geekinfiltration.io
              </Typography>
            </Box>
            <Iconify
              icon="octicon:copy-16"
              sx={{
                width: 15,
                height: 15,
                color: LANDING.textMuted,
                display: { xs: 'none', sm: 'block' },
              }}
            />
          </Box>

          {/* Columns: 4-up grid on desktop, swipe strip on mobile */}
          <Box
            ref={stripRef}
            onScroll={handleStripScroll}
            sx={{
              display: { xs: 'flex', md: 'grid' },
              gridTemplateColumns: { md: 'repeat(4, 1fr)' },
              overflowX: { xs: 'auto', md: 'visible' },
              scrollSnapType: { xs: 'x mandatory', md: 'none' },
              WebkitOverflowScrolling: 'touch',
              // Hide the scrollbar; page dots communicate position instead.
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {BOARD_COLUMNS.map((column, index) => (
              <BoardColumnCard
                key={column.owner}
                column={column}
                isLast={index === BOARD_COLUMNS.length - 1}
              />
            ))}
          </Box>
        </Box>
      </Reveal>

      {/* Mobile-only page dots — discoverability for the off-screen columns */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          gap: 0.5,
          mt: 2,
        }}
      >
        {BOARD_COLUMNS.map((column, index) => (
          <Box
            component="button"
            type="button"
            key={column.owner}
            aria-label={`Show ${column.owner}'s column`}
            aria-current={activeColumn === index}
            onClick={() => scrollToColumn(index)}
            sx={{
              // >=24px transparent hit area (WCAG 2.5.8) around the small visual
              // dot; gap:0.5 keeps ~28px between centers so targets never overlap.
              display: 'grid',
              placeItems: 'center',
              width: 24,
              height: 24,
              p: 0,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 3px ${LANDING.greenFocusRing}`,
              },
            }}
          >
            {/* Visual dot — unchanged 8px (widens to a 22px pill when active) */}
            <Box
              aria-hidden
              sx={{
                width: activeColumn === index ? 22 : 8,
                height: 8,
                borderRadius: 4,
                transition: prefersReducedMotion
                  ? 'none'
                  : 'width .2s ease, background-color .2s ease',
                bgcolor:
                  activeColumn === index ? LANDING.green : LANDING.border,
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
