import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'
import type { MotionProps } from 'framer-motion'

import {
  EASE_OUT_EXPO,
  REVEAL_DURATION_S,
  REVEAL_OFFSET_PX,
  REVEAL_VIEWPORT_MARGIN,
} from '../config'

interface RevealProps extends BoxProps {
  /** Seconds to delay the entrance, for gentle stagger within a section. */
  delay?: number
  /** Initial downward offset in px (auto-disabled under prefers-reduced-motion). */
  y?: number
  /**
   * Fire the entrance on mount (`animate`) instead of on scroll-into-view
   * (`whileInView`). Use for above-the-fold content that is always visible on
   * load, so its reveal never gates on an IntersectionObserver.
   */
  immediate?: boolean
}

/**
 * Entrance wrapper (fade + rise) for the landing's few intentional motions: scroll-
 * triggered by default (fires once on viewport enter), or on mount when `immediate`
 * (above-the-fold content that must not depend on an IntersectionObserver). Honors
 * prefers-reduced-motion by dropping the translate. Wraps any section block.
 * @param delay - stagger delay in seconds (default 0).
 * @param y - starting vertical offset in px (default 24; forced 0 when reduced).
 * @param immediate - fire on mount instead of on scroll-into-view (default false).
 * @returns A motion.div-backed MUI Box that animates in.
 * @example <Reveal delay={0.1}><Heading /></Reveal>
 * @example <Reveal immediate><HeroHeadline /></Reveal> // above-the-fold, no observer
 */
export default function Reveal({
  children,
  delay = 0,
  y = REVEAL_OFFSET_PX,
  immediate = false,
  ...boxProps
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const initialY = prefersReducedMotion ? 0 : y

  // Above-the-fold content fires on mount (`animate`); below-the-fold content waits
  // for scroll-into-view (`whileInView` + once) so it still reveals as you scroll.
  const entranceProps: MotionProps = immediate
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: REVEAL_VIEWPORT_MARGIN },
      }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: initialY }}
      {...entranceProps}
      transition={{ duration: REVEAL_DURATION_S, delay, ease: EASE_OUT_EXPO }}
      {...boxProps}
    >
      {children}
    </Box>
  )
}
