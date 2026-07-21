# Landing Page Design System

Reference for the public (signed-out) landing page in `src/LandingPage/`.
Source of truth for tokens, type, motion, and responsive behavior. Derived from the
approved **refine-1** design (`/design-shotgun` → `/plan-design-review`, 2026-07-21).

> Concept: for open-source lovers — skip social posts and Discord chatter, read the
> actual PRs, Issues, and Discussions directly. **Primary source over secondhand takes.**

The landing is **dark-only** and self-contained: it renders inside a landing-scoped
MUI `ThemeProvider` (`index.tsx`) so its palette and type are locked regardless of the
global app theme. All tokens live in `sections/tokens.ts`.

## Color tokens (`LANDING` in `sections/tokens.ts`)

| Token         | Hex                   | Role                                            |
| ------------- | --------------------- | ----------------------------------------------- |
| `bg`          | `#0d1117`             | Page background (GitHub canvas)                 |
| `bgDeep`      | `#010409`             | Deepest chrome: browser url bar, comment bubble |
| `panel`       | `#161b22`             | Cards, board columns                            |
| `panelRaised` | `#1c2230`             | Avatar fallback / raised surfaces               |
| `border`      | `#30363d`             | Hairline borders                                |
| `green`       | `#39d353`             | Primary accent (contribution green)             |
| `greenDim`    | `#26a641`             | Gradient end / secondary accent                 |
| `greenSoft`   | `rgba(57,211,83,.12)` | Tint fills, hover washes                        |
| `greenBorder` | `rgba(57,211,83,.45)` | Accent outlines, focus rings, glow              |
| `text`        | `#ffffff`             | Primary text                                    |
| `textSubtle`  | `#c9d1d9`             | Body + comment text                             |
| `textMuted`   | `#9198a1`             | Secondary metadata (handles, timestamps)        |
| `danger`      | `#f85149`             | "THE NOISE" side                                |
| `purple`      | `#a371f7`             | GitHub Issue badges                             |

Tokens are also mirrored as CSS variables (`landingCssVars`, e.g. `--gi-green`) on the
landing root for raw-CSS spots (keyframes / box-shadow).

### Verified WCAG contrast (all body text ≥ 4.5:1)

| Pair                          | Ratio  |
| ----------------------------- | ------ |
| textMuted `#9198a1` on panel  | 5.94:1 |
| textMuted `#9198a1` on bg     | 6.50:1 |
| textSubtle `#c9d1d9` on panel | 11.2:1 |
| green on bg (eyebrow/badges)  | 9.57:1 |
| purple on panel (Issue badge) | 5.16:1 |
| danger on panel (THE NOISE)   | 5.16:1 |
| white headline on bg          | 18.9:1 |

If a new muted grey is introduced, keep it ≥ 4.5:1 on `panel` (the lighter of the two
surfaces). `textMuted` was raised from GitHub's `#8b949e` to `#9198a1` for margin.

## Typography

Self-hosted variable fonts via `@fontsource-variable/*`, registered once in
`sections/fonts.ts`. No default stacks as primary (system stack is fallback only).

- **Geist** (`'Geist Variable'`) — display + body. Default via the landing theme.
- **Geist Mono** (`'Geist Mono Variable'`) — eyebrow, PR/Issue badges, VS badge, and
  the terminal CTA command. Applied explicitly with `LANDING_FONT_MONO`.

Headline (`h1`) is the single page anchor: `2.5rem → 4.5rem`, weight 700,
letter-spacing `-0.03em`.

## Layout & spacing

- Shared measure: `LANDING_MAX_WIDTH_PX = 1200`, centered (`mx: 'auto'`).
- Section rhythm: `py: { xs: 4, md: 6 }`, horizontal `px: 3`.
- Sticky header (`64/72px`), transparent over the hero, frosted (`blur`) after
  `HEADER_SCROLL_BLUR_PX = 24` of scroll.

## Motion (`sections/Reveal.tsx`)

- Entrance: fade + 24px rise, `whileInView` with `viewport={{ once: true }}`,
  `duration .55s`, ease `[0.22, 1, 0.36, 1]`. Uses framer-motion `motion` directly
  (no `LazyMotion` provider is mounted in this app).
- Board: soft green-glow **pulse** (`giBoardGlow`, 4.5s) on the browser frame.
- **`prefers-reduced-motion`**: Reveal drops the translate; the glow animation is
  disabled. Honor this for any new motion.

## Responsive board (`sections/MockBoard.tsx`)

- Desktop (`md+`): 4-column CSS grid.
- Mobile (`xs`): horizontal **swipe strip** — `scroll-snap-type: x mandatory`, columns
  at `82%` width (peek of the next), scrollbar hidden. Page **dots** below track the
  active column (`onScroll`) and scroll a column into view on click/Enter.
- Every column is `tabIndex={0}` with an `aria-label`, so the strip is
  keyboard-reachable, not swipe-only.

## Accessibility

- Landmarks: `<header>` (MainHeader), `<main>` (HomeRootComponent), `<footer>`
  (MainFooter). Each section is a labeled `<section>`. Exactly one `<h1>` (hero).
- `focus-visible` rings on every `Login with GitHub` button, board column, page dot,
  and the footer link.

## Component map

| File                         | Role                                             |
| ---------------------------- | ------------------------------------------------ |
| `index.tsx`                  | Landing root: scoped dark theme + fonts + layout |
| `MainHeader.tsx`             | Sticky brand header + login CTA                  |
| `HomeRootComponent.tsx`      | `<main>` section composition (refine-1 order)    |
| `MainFooter.tsx`             | Copyright footer                                 |
| `sections/Hero.tsx`          | Eyebrow + `h1` + subtext + CTA                   |
| `sections/MockBoard.tsx`     | Browser-framed 4-column mock board               |
| `sections/FeatureCards.tsx`  | Three feature panels                             |
| `sections/NoiseVsSource.tsx` | Red-vs-green comparison band                     |
| `sections/TerminalCTA.tsx`   | Terminal-prompt closing CTA                      |
| `sections/LoginButton.tsx`   | The single shared CTA (→ `GITHUB_AUTH_ENDPOINT`) |
| `sections/BrandMark.tsx`     | Inline-SVG green logo mark                       |
| `sections/Reveal.tsx`        | Scroll entrance wrapper                          |
| `sections/boardData.ts`      | Static mock board content                        |
| `sections/tokens.ts`         | All color/type/layout tokens                     |

## Not in scope (deliberate)

- Live/dynamic board data — the hero board is a **static idealized mock** by design
  (the real product UI evolves; a screenshot would go stale).
- Light mode — the landing is dark-only.
- The signed-in app UI — this is marketing only.
