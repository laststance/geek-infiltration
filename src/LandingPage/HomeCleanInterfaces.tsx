import { Box, Container, Typography, useTheme } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'

import { MotionInView, varFade } from './animate'
import Image from './Image'

const RootStyle = styled('div')(({ theme }) => ({
  paddingBottom: theme.spacing(10),
  paddingTop: theme.spacing(15),
}))

const ContentStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  maxWidth: 520,
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
    textAlign: 'left',
    zIndex: 11,
  },
}))

// ----------------------------------------------------------------------

export function HomeCleanInterfaces() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <RootStyle>
      <Container>
        <ContentStyle>
          <MotionInView variants={varFade().inUp}>
            <Typography
              component="div"
              variant="overline"
              sx={{ color: 'text.disabled', mb: 2 }}
            >
              subscriptions
            </Typography>
          </MotionInView>

          <MotionInView variants={varFade().inUp}>
            <Typography
              component="p"
              variant="h2"
              sx={{
                mb: 2,
                ...(!isLight && {
                  textShadow: (theme) =>
                    `4px 4px 16px ${alpha(theme.palette.grey[800], 0.48)}`,
                }),
              }}
            >
              Subscribe to people and repositories you care about
            </Typography>
          </MotionInView>
        </ContentStyle>

        <Box sx={{ position: 'relative' }}>
          <MotionInView variants={varFade().inUp} sx={{ position: 'relative' }}>
            <Image
              disabledEffect
              visibleByDefault
              alt="Geek Infiltration timeline preview"
              src="/og-image.png"
            />
          </MotionInView>
        </Box>
      </Container>
    </RootStyle>
  )
}
