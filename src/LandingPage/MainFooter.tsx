// @mui
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import SocialsButton from './SocialsButton'

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}))

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item md={3}>
            <Stack
              direction="row"
              justifyContent={{ md: 'flex-start', xs: 'center' }}
              sx={{ mb: 5, mt: 5 }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>
        </Grid>
        <Container>
          <Typography
            component="p"
            variant="body2"
            sx={{
              fontSize: 13,
              mt: 10,
              pb: 5,
              textAlign: 'center',
            }}
          >
            © 2023.{' '}
            <Link
              href="https://laststance.io/"
              target="_blank"
              rel="noreferrer"
            >
              Laststance.io
            </Link>{' '}
            All rights reserved
          </Typography>
        </Container>
      </Container>
    </RootStyle>
  )
}
