import type { StackProps } from '@mui/material'
import { Button, Box, Link, Container, Typography, Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import { m } from 'framer-motion'
// @mui

// routes
import { MotionContainer, varFade } from './animate'
import Iconify from './Iconify'
import Image from './Image'
// components
import TextIconLabel from './TextIconLabel'

// ----------------------------------------------------------------------

const RootStyle = styled(m.div)(({ theme }) => ({
  backgroundColor: theme.palette.grey[400],
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    alignItems: 'center',
    display: 'flex',
    height: '100vh',
    left: 0,
    position: 'fixed',
    top: 0,
    width: '100%',
  },
}))

const ContentStyle = styled((props: StackProps) => (
  <Stack spacing={5} {...props} />
))(({ theme }) => ({
  margin: 'auto',
  maxWidth: 520,
  paddingBottom: theme.spacing(15),
  paddingTop: theme.spacing(15),
  position: 'relative',
  textAlign: 'center',
  zIndex: 10,
  [theme.breakpoints.up('md')]: {
    margin: 'unset',
    textAlign: 'left',
  },
}))

const HeroOverlayStyle = styled(m.img)({
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  width: '100%',
  zIndex: 9,
})

const HeroImgStyle = styled(m.img)(({ theme }) => ({
  bottom: 0,
  margin: 'auto',
  position: 'absolute',
  right: 0,
  top: 0,
  width: '100%',
  zIndex: 8,
  [theme.breakpoints.up('lg')]: {
    height: '48vh',
    right: '8%',
    width: 'auto',
  },
}))

// ----------------------------------------------------------------------

export function HomeHero() {
  return (
    <MotionContainer>
      <RootStyle>
        <HeroImgStyle
          alt="hero"
          src="https://minimal-assets-api.vercel.app/assets/images/home/hero.png"
          variants={varFade().inUp}
        />

        <Container>
          <ContentStyle>
            <m.div variants={varFade().inRight}>
              <Typography variant="h1" sx={{ color: 'common.white' }}>
                Start a <br />
                new project <br /> with
                <Typography
                  component="span"
                  variant="h1"
                  sx={{ color: 'primary.main' }}
                >
                  &nbsp;Minimal
                </Typography>
              </Typography>
            </m.div>

            <m.div variants={varFade().inRight}>
              <Typography sx={{ color: 'common.white' }}>
                The starting point for your next project based on
                easy-to-customize MUI helps you build apps faster and better.
              </Typography>
            </m.div>

            <Stack
              spacing={2.5}
              alignItems="center"
              direction={{ md: 'row', xs: 'column' }}
            >
              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt="sketch icon"
                      src="https://minimal-assets-api.vercel.app/assets/images/home/ic_sketch_small.svg"
                      sx={{ height: 20, mr: 1, width: 20 }}
                    />
                  }
                  value={
                    <Link
                      href="https://www.sketch.com/s/0fa4699d-a3ff-4cd5-a3a7-d851eb7e17f0"
                      target="_blank"
                      rel="noopener"
                      color="common.white"
                      sx={{ typography: 'body2' }}
                    >
                      Preview Sketch
                    </Link>
                  }
                />
              </m.div>

              <m.div variants={varFade().inRight}>
                <TextIconLabel
                  icon={
                    <Image
                      alt="sketch icon"
                      src="https://minimal-assets-api.vercel.app/assets/images/home/ic_figma_small.svg"
                      sx={{ height: 20, mr: 1, width: 20 }}
                    />
                  }
                  value={
                    <Link
                      href="https://www.figma.com/file/x7earqGD0VGFjFdk5v2DgZ/%5BPreview%5D-Minimal-Web?node-id=866%3A55474"
                      target="_blank"
                      rel="noopener"
                      color="common.white"
                      sx={{ typography: 'body2' }}
                    >
                      Preview Figma
                    </Link>
                  }
                />
              </m.div>
            </Stack>

            <m.div variants={varFade().inRight}>
              <Button
                size="large"
                variant="contained"
                startIcon={
                  <Iconify icon={'eva:flash-fill'} width={20} height={20} />
                }
              >
                Live Preview
              </Button>
            </m.div>

            <Stack spacing={2.5}>
              <m.div variants={varFade().inRight}>
                <Typography variant="overline" sx={{ color: 'primary.light' }}>
                  Available For
                </Typography>
              </m.div>

              <Stack
                direction="row"
                spacing={1.5}
                justifyContent={{ md: 'flex-start', xs: 'center' }}
              >
                {['ic_sketch', 'ic_figma', 'ic_js', 'ic_ts', 'ic_nextjs'].map(
                  (resource) => (
                    <m.img
                      key={resource}
                      variants={varFade().inRight}
                      src={`https://minimal-assets-api.vercel.app/assets/images/home/${resource}.svg`}
                    />
                  )
                )}
              </Stack>
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
      <Box sx={{ height: { md: '100vh' } }} />
    </MotionContainer>
  )
}
