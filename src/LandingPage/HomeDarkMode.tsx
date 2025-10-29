import { Container, Typography, Grid } from '@mui/material'
import { styled } from '@mui/material/styles'

import { MotionInView, varFade } from './animate'
import Image from './Image'

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  padding: theme.spacing(28, 0),
}))

const ContentStyle = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  position: 'relative',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    display: 'inline-flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    marginBottom: 0,
    textAlign: 'left',
  },
}))

export function HomeDarkMode() {
  return (
    <RootStyle>
      <Container sx={{ position: 'relative' }}>
        <Image
          visibleByDefault
          disabledEffect
          alt="image shape"
          src="https://minimal-assets-api.vercel.app/assets/images/home/shape.svg"
          sx={{
            bottom: 0,
            display: { md: 'block', xs: 'none' },
            height: 720,
            my: 'auto',
            opacity: 0.48,
            position: 'absolute',
            right: 0,
            top: 0,
            width: 720,
          }}
        />

        <Grid
          container
          spacing={5}
          direction="row-reverse"
          justifyContent="space-between"
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <ContentStyle>
              <MotionInView variants={varFade().inUp}>
                <Typography
                  component="div"
                  variant="overline"
                  sx={{ color: 'text.disabled', mb: 2 }}
                >
                  Easy switch between styles.
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography variant="h2" sx={{ color: 'common.white', mb: 3 }}>
                  Dark mode
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography sx={{ color: 'common.white', mb: 5 }}>
                  A dark theme that feels easier on the eyes.
                </Typography>
              </MotionInView>
            </ContentStyle>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} sx={{ position: 'relative' }}>
            <MotionInView threshold={0.5} variants={varFade().inUp}>
              <Image
                disabledEffect
                alt="light mode"
                src="https://minimal-assets-api.vercel.app/assets/images/home/lightmode.png"
              />
            </MotionInView>

            <MotionInView
              threshold={0.5}
              variants={varFade().inDown}
              sx={{ left: 0, position: 'absolute', top: 0 }}
            >
              <Image
                disabledEffect
                alt="dark mode"
                src="https://minimal-assets-api.vercel.app/assets/images/home/darkmode.png"
              />
            </MotionInView>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
