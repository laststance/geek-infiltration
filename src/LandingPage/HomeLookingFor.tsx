import { Button, Container, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

import { GITHUB_AUTH_URL } from '../constants/GITHUB_AUTH_URL'

import { MotionInView, varFade } from './animate'
import Iconify from './Iconify'
import Image from './Image'

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}))

export function HomeLookingFor() {
  return (
    <RootStyle>
      <Container>
        <Grid
          container
          spacing={{ md: 3, xs: 8 }}
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ textAlign: { md: 'left', xs: 'center' } }}
          >
            <MotionInView variants={varFade().inDown}>
              <Typography
                variant="overline"
                component="div"
                sx={{ color: 'text.disabled' }}
              >
                Ready to explore?
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Typography variant="h2" sx={{ mb: 5, mt: 2 }}>
                Start with GitHub login
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Button
                color="inherit"
                size="large"
                variant="outlined"
                href={GITHUB_AUTH_URL}
                endIcon={<Iconify icon={'ic:round-arrow-right-alt'} />}
              >
                Login with GitHub
              </Button>
            </MotionInView>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <MotionInView
              variants={varFade().inUp}
              sx={{
                mb: { md: 0, xs: 3 },
              }}
            >
              <Image
                disabledEffect
                alt="GitHub activity dashboard"
                src="/og-image.png"
              />
            </MotionInView>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
