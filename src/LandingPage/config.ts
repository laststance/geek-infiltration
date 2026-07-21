/** Scroll distance (px) after which the sticky landing header gains its blur + border. */
export const HEADER_SCROLL_BLUR_PX = 24

// Entrance-motion tokens shared by <Reveal> and the board glow. Centralized so the
// fade/rise timing lives in one place; framer-motion is seconds-native, hence _S.

/** <Reveal> fade+rise duration in seconds. */
export const REVEAL_DURATION_S = 0.55
/** <Reveal> starting vertical offset (px); dropped to 0 under prefers-reduced-motion. */
export const REVEAL_OFFSET_PX = 24
/** Ease-out-expo cubic-bezier for the reveal: fast start, gentle settle. */
export const EASE_OUT_EXPO: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
]
/** How far past the viewport edge a scroll-reveal begins (CSS margin string). */
export const REVEAL_VIEWPORT_MARGIN = '-80px'
/** Board glow opacity-pulse cycle length in seconds. */
export const BOARD_GLOW_DURATION_S = 4.5
