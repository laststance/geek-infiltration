import { Box, Button, Container, Typography, Grid } from '@mui/material'
import { alpha, useTheme, styled } from '@mui/material/styles'

import { MotionInView, varFade } from './animate'
import Image from './Image'

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(24, 0),
}))

const ContentStyle = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  textAlign: 'center',
  width: '100%',
  [theme.breakpoints.up('md')]: {
    marginBottom: 0,
    textAlign: 'left',
  },
}))

const ScreenStyle = styled(MotionInView)(({ theme }) => ({
  '& img': {
    borderRadius: 8,
    [theme.breakpoints.up('sm')]: {
      borderRadius: 12,
    },
  },
  backgroundColor:
    theme.palette.grey[theme.palette.mode === 'light' ? 300 : 800],
  borderRadius: 8,
  maxWidth: 160,
  paddingBottom: 1,
  [theme.breakpoints.up('sm')]: {
    borderRadius: 12,
    maxWidth: 320,
    paddingRight: 4,
  },
  paddingRight: 2,
}))

const COMMON = {
  opacity: 0,
  scaleX: 0.86,
  scaleY: 1,
  skewX: 0,
  skewY: 8,
  translateX: 0,
  translateY: 0,
}

const variantScreenLeft = {
  animate: { ...COMMON, opacity: 1, translateX: '-50%', translateY: 40 },
  initial: COMMON,
}
const variantScreenCenter = {
  animate: { ...COMMON, opacity: 1 },
  initial: COMMON,
}
const variantScreenRight = {
  animate: { ...COMMON, opacity: 1, translateX: '50%', translateY: -40 },
  initial: COMMON,
}

// ----------------------------------------------------------------------

export function HomeHugePackElements() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'
  const isRTL = theme.direction === 'rtl'

  const screenLeftAnimate = variantScreenLeft
  const screenCenterAnimate = variantScreenCenter
  const screenRightAnimate = variantScreenRight

  return (
    <RootStyle>
      <Container>
        <Grid container spacing={5} justifyContent="center">
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ alignItems: 'center', display: 'flex' }}
          >
            <ContentStyle>
              <MotionInView variants={varFade().inUp}>
                <Typography
                  component="div"
                  variant="overline"
                  sx={{ color: 'text.disabled', mb: 2 }}
                >
                  Interface Starter Kit
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography variant="h2" sx={{ mb: 3 }}>
                  Huge pack <br />
                  of elements
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Typography
                  sx={{
                    color: isLight ? 'text.secondary' : 'common.white',
                    mb: 5,
                  }}
                >
                  We collected most popular elements. Menu, sliders, buttons,
                  inputs etc. are all here. Just dive in!
                </Typography>
              </MotionInView>

              <MotionInView variants={varFade().inUp}>
                <Button size="large" color="inherit" variant="outlined">
                  View All Components
                </Button>
              </MotionInView>
            </ContentStyle>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }} dir="ltr">
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {[...Array(3)].map((_, index) => (
                <ScreenStyle
                  key={index}
                  threshold={0.72}
                  variants={{
                    ...(index === 0 && screenLeftAnimate),
                    ...(index === 1 && screenCenterAnimate),
                    ...(index === 2 && screenRightAnimate),
                  }}
                  transition={{ duration: 0.72, ease: 'easeOut' }}
                  sx={{
                    boxShadow: `${isRTL ? -80 : 80}px -40px 80px ${alpha(
                      isLight
                        ? theme.palette.grey[600]
                        : theme.palette.common.black,
                      0.48,
                    )}`,
                    ...(index === 0 && {
                      position: 'absolute',
                      zIndex: 3,
                    }),
                    ...(index === 1 && { zIndex: 2 }),
                    ...(index === 2 && {
                      boxShadow: 'none',
                      position: 'absolute',
                      zIndex: 1,
                    }),
                  }}
                >
                  <Image
                    disabledEffect
                    alt={`screen ${index + 1}`}
                    src={`https://minimal-assets-api.vercel.app/assets/images/home/screen_${
                      isLight ? 'light' : 'dark'
                    }_${index + 1}.png`}
                  />
                </ScreenStyle>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </RootStyle>
  )
}
