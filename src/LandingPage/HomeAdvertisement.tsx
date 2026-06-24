import { Button, Box, Container, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'

import { useGitHubAuthUrl } from '../hooks/useGitHubAuthUrl'

import { MotionInView, varFade } from './animate'
import Image from './Image'

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
  const { githubAuthUrl, prepareGitHubAuth } = useGitHubAuthUrl()

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
              alt="Geek Infiltration GitHub activity preview"
              src="/og-image.png"
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
              Track GitHub work
              <br /> in one place
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Button
              size="large"
              variant="contained"
              href={githubAuthUrl}
              onClick={prepareGitHubAuth}
              sx={{
                '&:hover': { bgcolor: 'grey.300' },
                bgcolor: 'common.white',
                boxShadow: (theme) => theme.customShadows.z8,
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.common.white),
                whiteSpace: 'nowrap',
              }}
            >
              Login with GitHub
            </Button>
          </MotionInView>
        </Box>
      </ContentStyle>
    </Container>
  )
}
