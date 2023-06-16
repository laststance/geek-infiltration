// @mui
import { styled } from '@mui/material/styles'

// components

import { HomeAdvertisement } from './HomeAdvertisement'
import { HomeCleanInterfaces } from './HomeCleanInterfaces'
import { HomeColorPresets } from './HomeColorPresets'
import { HomeDarkMode } from './HomeDarkMode'
import { HomeHero } from './HomeHero'
import { HomeHugePackElements } from './HomeHugePackElements'
import { HomeLookingFor } from './HomeLookingFor'
import { HomeMinimal } from './HomeMinimal'
import { HomePricingPlans } from './HomePricingPlans'
import Page from './Page'

const RootStyle = styled('div')(() => ({
  height: '100%',
}))

const ContentStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  position: 'relative',
}))

// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <Page title="The starting point for your next project">
      <RootStyle>
        <HomeHero />
        <ContentStyle>
          <HomeMinimal />

          <HomeHugePackElements />

          <HomeDarkMode />

          <HomeColorPresets />

          <HomeCleanInterfaces />

          <HomePricingPlans />

          <HomeLookingFor />

          <HomeAdvertisement />
        </ContentStyle>
      </RootStyle>
    </Page>
  )
}