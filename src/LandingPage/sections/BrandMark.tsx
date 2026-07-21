import { Box } from '@mui/material'

import { LANDING } from './tokens'

interface BrandMarkProps {
  /** Rendered square size in px (default 34). */
  size?: number
}

/**
 * Geek Infiltration logo mark: a green rounded tile holding a terminal `>_` glyph,
 * tying the brand to the "infiltrate the signal" concept. Inline SVG so it stays
 * crisp at any size and needs no network/font load. Used in the header and footer.
 * @param size - square edge length in px (default 34).
 * @returns A decorative inline-SVG brand tile (aria-hidden; wordmark carries the name).
 * @example <BrandMark size={40} />
 */
export default function BrandMark({ size = 34 }: BrandMarkProps) {
  return (
    <Box
      aria-hidden
      component="svg"
      viewBox="0 0 32 32"
      sx={{ width: size, height: size, display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="gi-mark-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={LANDING.green} />
          <stop offset="1" stopColor={LANDING.greenDim} />
        </linearGradient>
      </defs>
      {/* Green tile */}
      <rect width="32" height="32" rx="8" fill="url(#gi-mark-fill)" />
      {/* Terminal chevron ">" in the page-dark color */}
      <path
        d="M10 10.5 L15.5 16 L10 21.5"
        fill="none"
        stroke={LANDING.bg}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Prompt underscore "_" */}
      <rect x="17" y="20" width="7" height="2.6" rx="1.3" fill={LANDING.bg} />
    </Box>
  )
}
