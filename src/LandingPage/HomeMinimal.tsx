// @mui
import { Box, Card, Container, Typography } from '@mui/material'
import { alpha, useTheme, styled } from '@mui/material/styles'

// components
import { MotionInView, varFade } from './animate'
import Image from './Image'

// ----------------------------------------------------------------------

const CARDS = [
  {
    description:
      'The set is built on the principles of the atomic design system. It helps you to create projects fastest and easily customized packages for your projects.',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_design.svg',
    title: 'UI & UX Design',
  },
  {
    description:
      'Easy to customize and extend each component, saving you time and money.',
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_code.svg',
    title: 'Development',
  },
  {
    description:
      'Consistent design in colors, fonts ... makes brand recognition easy.',
    icon: '/logo/logo_single.svg',
    title: 'Branding',
  },
]

const shadowIcon = (color: string) =>
  `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(15),
  [theme.breakpoints.up('md')]: {
    paddingBottom: theme.spacing(15),
  },
}))

const CardStyle = styled(Card)(({ theme }) => {
  const shadowCard = (opacity: number) =>
    theme.palette.mode === 'light'
      ? alpha(theme.palette.grey[500], opacity)
      : alpha(theme.palette.common.black, opacity)

  return {
    '&.cardCenter': {
      [theme.breakpoints.up('md')]: {
        '&:before': {
          backgroundColor: theme.palette.background.paper,
          borderRadius: Number(theme.shape.borderRadius) * 2,
          bottom: 0,
          boxShadow: `-20px 20px 40px 0 ${shadowCard(0.12)}`,
          content: "''",
          height: 'calc(100% - 40px)',
          left: 0,
          margin: 'auto',
          position: 'absolute',
          right: 0,
          top: 0,
          width: 'calc(100% - 40px)',
          zIndex: -1,
        },
        backgroundColor: theme.palette.background.paper,
        boxShadow: `-40px 40px 80px 0 ${shadowCard(0.4)}`,
        marginTop: -80,
      },
    },
    '&.cardLeft': {
      [theme.breakpoints.up('md')]: { marginTop: -40 },
    },
    border: 0,
    boxShadow: theme.customShadows.z12,
    margin: 'auto',
    maxWidth: 380,
    minHeight: 440,
    [theme.breakpoints.up('md')]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
      boxShadow: 'none',
    },
    padding: theme.spacing(10, 5, 0),
    textAlign: 'center',
  }
})

// ----------------------------------------------------------------------

export function HomeMinimal() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <RootStyle>
      <Container>
        <Box
          sx={{
            mb: { md: 25, xs: 10 },
            textAlign: 'center',
          }}
        >
          <MotionInView variants={varFade().inUp}>
            <Typography
              component="div"
              variant="overline"
              sx={{ color: 'text.disabled', mb: 2 }}
            >
              Minimal
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography variant="h2">What minimal helps you?</Typography>
          </MotionInView>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gap: { lg: 10, xs: 5 },
            gridTemplateColumns: { md: 'repeat(3, 1fr)', xs: 'repeat(1, 1fr)' },
          }}
        >
          {CARDS.map((card, index) => (
            <MotionInView variants={varFade().inUp} key={card.title}>
              <CardStyle
                className={
                  (index === 0 && 'cardLeft') ||
                  (index === 1 && 'cardCenter') ||
                  ''
                }
              >
                <Image
                  src={card.icon}
                  alt={card.title}
                  sx={{
                    filter: (theme) => shadowIcon(theme.palette.primary.main),
                    height: 40,
                    mb: 10,
                    mx: 'auto',
                    width: 40,
                    ...(index === 0 && {
                      filter: (theme) => shadowIcon(theme.palette.info.main),
                    }),
                    ...(index === 1 && {
                      filter: (theme) => shadowIcon(theme.palette.error.main),
                    }),
                  }}
                />
                <Typography variant="h5" paragraph>
                  {card.title}
                </Typography>
                <Typography
                  sx={{ color: isLight ? 'text.secondary' : 'common.white' }}
                >
                  {card.description}
                </Typography>
              </CardStyle>
            </MotionInView>
          ))}
        </Box>
      </Container>
    </RootStyle>
  )
}
