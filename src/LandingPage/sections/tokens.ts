/**
 * Landing-only design tokens: dark GitHub-native palette + Geist type, exposed as
 * raw hex (for JS needs like framer-motion / box-shadow) and as a CSS-variable map
 * spread onto the landing root. Exists because the marketing landing is dark-locked
 * regardless of the global MUI theme, so every section reads one source of truth.
 * @example sx={{ color: LANDING.green }}           // JS token
 * @example sx={{ ...landingCssVars, bgcolor: 'var(--gi-bg)' }} // CSS variable on root
 */
export const LANDING = {
  bg: '#0d1117', // page background (GitHub canvas default)
  bgDeep: '#010409', // deepest chrome (browser frame url bar / footer)
  panel: '#161b22', // cards, board columns
  panelRaised: '#1c2230', // hover / comment bubble
  border: '#30363d', // GitHub default border grey
  green: '#39d353', // primary accent (brightest contribution green)
  greenDim: '#26a641', // secondary accent / gradient end
  greenSoft: 'rgba(57, 211, 83, 0.12)', // tint fills, hover washes
  greenBorder: 'rgba(57, 211, 83, 0.45)', // accented outlines / glow ring
  greenHover: 'rgba(57, 211, 83, 0.2)', // hover wash on the accent CTA
  greenFocusRing: 'rgba(57, 211, 83, 0.4)', // keyboard focus halo (CTA + page dots)
  text: '#ffffff', // primary text
  textSubtle: '#c9d1d9', // body + comment text (high contrast on panel)
  textMuted: '#9198a1', // secondary metadata (>= 4.5:1 on panel, a11y-verified)
  danger: '#f85149', // GitHub red — "THE NOISE" side
  dangerBorder: 'rgba(248, 81, 73, 0.35)', // danger outline (mirrors greenBorder for the noise column)
  purple: '#a371f7', // GitHub issue purple — Issue badges
} as const

/** Geist for display/body; system stack only as invisible fallback while the woff2 loads. */
export const LANDING_FONT_SANS =
  "'Geist Variable', ui-sans-serif, system-ui, -apple-system, sans-serif"
/** Geist Mono for eyebrow, badges, and the terminal CTA. */
export const LANDING_FONT_MONO =
  "'Geist Mono Variable', ui-monospace, 'SFMono-Regular', 'Menlo', monospace"

/**
 * CSS custom properties for the landing root; lets raw-CSS spots (keyframes,
 * box-shadow strings) read the same palette via `var(--gi-*)`.
 */
export const landingCssVars = {
  '--gi-bg': LANDING.bg,
  '--gi-panel': LANDING.panel,
  '--gi-border': LANDING.border,
  '--gi-green': LANDING.green,
  '--gi-green-dim': LANDING.greenDim,
  '--gi-text': LANDING.text,
  '--gi-text-muted': LANDING.textMuted,
} as const

/** Fixed content max-width so header, hero, and bands share one measure. */
export const LANDING_MAX_WIDTH_PX = 1200

/**
 * Screen-reader-only style for section headings that restore a valid h1→h2→h3
 * outline without changing the visual design. Standard clip technique — stays in
 * the accessibility tree (NOT `display:none`, which would drop the heading from it).
 * Local (not `@mui/utils`) because that package is a pnpm phantom dep here.
 * @example <Typography component="h2" sx={LANDING_VISUALLY_HIDDEN}>What you get</Typography>
 */
export const LANDING_VISUALLY_HIDDEN = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
} as const
