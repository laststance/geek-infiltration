import { Box, Stack } from '@mui/material'

import Home from './HomeRootComponent'
import MainFooter from './MainFooter'
import MainHeader from './MainHeader'

const LandingPage: React.FC = () => (
  <Stack sx={{ minHeight: 1 }}>
    <MainHeader />
    <Home />
    <Box sx={{ flexGrow: 1 }} />
    <MainFooter />
  </Stack>
)

export default LandingPage
