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
        <Grid
          container
          spacing={5}
          direction="row-reverse"
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <ContentStyle>
              <MotionInView variants={varFade().inUp}>
                <Typography
                  component="div"
                  variant="overline"
                  sx={{ color: 'text.disabled', mb: 2 }}
                >
                  Timeline focus
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography variant="h2" sx={{ color: 'common.white', mb: 3 }}>
                  Read GitHub without the noise
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography sx={{ color: 'common.white', mb: 5 }}>
                  Group related PR, issue, and discussion comments into calm
                  columns so review work stays scannable.
                </Typography>
              </MotionInView>
            </ContentStyle>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }} sx={{ position: 'relative' }}>
            <MotionInView threshold={0.5} variants={varFade().inUp}>
              <Image
                disabledEffect
                alt="GitHub activity timeline preview"
                src="/og-image.png"
              />
            </MotionInView>

            <MotionInView
              threshold={0.5}
              variants={varFade().inDown}
              sx={{ left: 0, position: 'absolute', top: 0 }}
            >
              <Image
                disabledEffect
                alt="GitHub activity focused timeline preview"
                src="/og-image.png"
              />
            </MotionInView>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
