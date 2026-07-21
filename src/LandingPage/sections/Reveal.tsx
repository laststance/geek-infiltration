import { Box } from '@mui/material'
import type { BoxProps } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'

interface RevealProps extends BoxProps {
  /** Seconds to delay the entrance, for gentle stagger within a section. */
  delay?: number
  /** Initial downward offset in px (auto-disabled under prefers-reduced-motion). */
  y?: number
}

/**
 * Scroll-triggered entrance wrapper (fade + rise) used for the landing's 2-3
 * intentional motions; fires once when the element enters the viewport and honors
 * prefers-reduced-motion by dropping the translate. Wraps any section block.
 * @param delay - stagger delay in seconds (default 0).
 * @param y - starting vertical offset in px (default 24; forced 0 when reduced).
 * @returns A motion.div-backed MUI Box that animates in on first view.
 * @example <Reveal delay={0.1}><Heading /></Reveal>
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  ...boxProps
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const initialY = prefersReducedMotion ? 0 : y

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: initialY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...boxProps}
    >
      {children}
    </Box>
  )
}
