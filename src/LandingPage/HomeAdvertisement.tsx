import { Button, Box, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'

// @mui
// components
import { MotionInView, varFade } from './animate'
import Image from './Image'

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  backgroundImage: `linear-gradient(135deg,
    ${theme.palette.primary.main} 0%,
    ${theme.palette.primary.dark} 100%)`,
  borderRadius: Number(theme.shape.borderRadius) * 2,
  margin: 'auto',
  maxWidth: 456,
  overflow: 'hidden',
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
    display: 'flex',
    maxWidth: '100%',
    paddingBottom: 0,
  },
}))

// ----------------------------------------------------------------------

export function HomeAdvertisement() {
  return (
    <Container>
      <ContentStyle>
        <MotionInView
          variants={varFade().inUp}
          sx={{
            mb: { md: 0, xs: 3 },
          }}
        >
          <m.div
            animate={{ y: [-20, 0, -20] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Image
              visibleByDefault
              alt="rocket"
              src="https://minimal-assets-api.vercel.app/assets/images/home/rocket.png"
              disabledEffect
              sx={{ maxWidth: 460 }}
            />
          </m.div>
        </MotionInView>

        <Box
          sx={{
            pl: { md: 10 },
            textAlign: { md: 'left', xs: 'center' },
          }}
        >
          <MotionInView
            variants={varFade().inDown}
            sx={{ color: 'common.white', mb: 5 }}
          >
            <Typography variant="h2">
              Get started with
              <br /> minimal kit today
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              target="_blank"
              rel="noopener"
              href="https://material-ui.com/store/items/minimal-dashboard/"
              sx={{
                '&:hover': { bgcolor: 'grey.300' },
                bgcolor: 'common.white',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.common.white),
                whiteSpace: 'nowrap',
              }}
            >
              Purchase Now
            </Button>
          </MotionInView>
        </Box>
      </ContentStyle>
    </Container>
  )
}
