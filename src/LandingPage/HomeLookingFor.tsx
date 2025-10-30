import { Button, Container, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

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
          alignItems="center"
          justifyContent="space-between"
          spacing={{ md: 3, xs: 8 }}
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
                Looking For a
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Typography variant="h2" sx={{ mb: 5, mt: 2 }}>
                Landing Page Template?
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Button
                color="inherit"
                size="large"
                variant="outlined"
                target="_blank"
                rel="noopener"
                href="https://material-ui.com/store/items/zone-landing-page/"
                endIcon={<Iconify icon={'ic:round-arrow-right-alt'} />}
              >
                Visit Zone Landing
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
                alt="rocket"
                src="https://minimal-assets-api.vercel.app/assets/images/home/zone_screen.png"
              />
            </MotionInView>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
