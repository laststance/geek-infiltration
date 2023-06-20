// @mui
import {
  Grid,
  Link,
  Divider,
  Container,
  Typography,
  Stack,
} from '@mui/material'
import { styled } from '@mui/material/styles'

import { PATH_PAGE } from './paths'
import SocialsButton from './SocialsButton'

// ----------------------------------------------------------------------

const LINKS = [
  {
    children: [
      { href: PATH_PAGE.about, name: 'About us' },
      { href: PATH_PAGE.contact, name: 'Contact us' },
      { href: PATH_PAGE.faqs, name: 'FAQs' },
    ],
    headline: 'Minimal',
  },
  {
    children: [
      { href: '#', name: 'Terms and Condition' },
      { href: '#', name: 'Privacy Policy' },
    ],
    headline: 'Legal',
  },
  {
    children: [
      { href: '#', name: 'support@minimals.cc' },
      { href: '#', name: 'Los Angeles, 359  Hidden Valley Road' },
    ],
    headline: 'Contact',
  },
]

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: 'relative',
}))

// ----------------------------------------------------------------------

export default function MainFooter() {
  return (
    <RootStyle>
      <Divider />
      <Container sx={{ pt: 10 }}>
        <Grid
          container
          justifyContent={{ md: 'space-between', xs: 'center' }}
          sx={{ textAlign: { md: 'left', xs: 'center' } }}
        >
          <Grid item xs={8} md={3}>
            <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              The starting point for your next project with Minimal UI Kit,
              built on the newest version of Material-UI ©, ready to be
              customized to your style.
            </Typography>

            <Stack
              direction="row"
              justifyContent={{ md: 'flex-start', xs: 'center' }}
              sx={{ mb: { md: 0, xs: 5 }, mt: 5 }}
            >
              <SocialsButton sx={{ mx: 0.5 }} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              direction={{ md: 'row', xs: 'column' }}
              justifyContent="space-between"
            >
              {LINKS.map((list) => (
                <Stack key={list.headline} spacing={2}>
                  <Typography component="p" variant="overline">
                    {list.headline}
                  </Typography>
                  {list.children.map((link) => (
                    // @ts-expect-error TODO
                    <Link
                      to={link.href}
                      key={link.name}
                      color="inherit"
                      variant="body2"
                      sx={{ display: 'block' }}
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          component="p"
          variant="body2"
          sx={{
            fontSize: 13,
            mt: 10,
            pb: 5,
            textAlign: { md: 'left', xs: 'center' },
          }}
        >
          © 2023.{' '}
          <Link href="https://laststance.io/" target="_blank" rel="noreferrer">
            Laststance.io
          </Link>{' '}
          All rights reserved
        </Typography>
      </Container>
    </RootStyle>
  )
}
