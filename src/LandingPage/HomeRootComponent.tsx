import { styled } from '@mui/material/styles'

import { HomeAdvertisement } from './HomeAdvertisement'
import { HomeCleanInterfaces } from './HomeCleanInterfaces'
import { HomeDarkMode } from './HomeDarkMode'
import { HomeHugePackElements } from './HomeHugePackElements'
import { HomeLookingFor } from './HomeLookingFor'
import { HomePricingPlans } from './HomePricingPlans'

const RootStyle = styled('div')(() => ({
  height: '100%',
}))

const ContentStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  overflow: 'hidden',
  position: 'relative',
}))

export default function HomePage() {
  return (
    <RootStyle>
      <ContentStyle>
        <HomeHugePackElements />

        <HomeDarkMode />

        <HomeCleanInterfaces />

        <HomePricingPlans />

        <HomeLookingFor />

        <HomeAdvertisement />
      </ContentStyle>
    </RootStyle>
  )
}
