import { Box } from '@mui/material'

import FeatureCards from './sections/FeatureCards'
import Hero from './sections/Hero'
import MockBoard from './sections/MockBoard'
import NoiseVsSource from './sections/NoiseVsSource'
import TerminalCTA from './sections/TerminalCTA'

/**
 * Landing main content in the approved refine-1 order: hero → mock product board →
 * feature cards → noise-vs-source band → terminal CTA. Carries the <main> landmark;
 * rendered between the header and footer by the landing entry.
 * @returns The landing page body.
 * @example <Home />
 */
export default function HomePage() {
  return (
    <Box component="main">
      <Hero />
      <MockBoard />
      <FeatureCards />
      <NoiseVsSource />
      <TerminalCTA />
    </Box>
  )
}
