// @mui
import { Box, Button, AppBar, Toolbar, Container } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

// hooks
// utils
import { MAIN_HEADER_DESKTOP, MAIN_HEADER_MOBILE } from './config'
import cssStyles from './cssStyles'
// config
// components
import Label from './Label'
import Logo from './Logo'
//
import navConfig from './MenuConfig'
import MenuDesktop from './MenuDesktop'
import MenuMobile from './MenuMobile'
import useOffSetTop from './useOffSetTop'
import useResponsive from './useResponsive'

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: MAIN_HEADER_MOBILE,
  transition: theme.transitions.create(['height', 'background-color'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  [theme.breakpoints.up('md')]: {
    height: MAIN_HEADER_DESKTOP,
  },
}))

const ToolbarShadowStyle = styled('div')(({ theme }) => ({
  borderRadius: '50%',
  bottom: 0,
  boxShadow: theme.customShadows.z8,
  height: 24,
  left: 0,
  margin: 'auto',
  position: 'absolute',
  right: 0,
  width: `calc(100% - 48px)`,
  zIndex: -1,
}))

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(MAIN_HEADER_DESKTOP)

  const theme = useTheme()

  const isDesktop = useResponsive('up', 'md')

  return (
    <AppBar sx={{ bgcolor: 'transparent', boxShadow: 0 }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: MAIN_HEADER_DESKTOP - 16 },
          }),
        }}
      >
        <Container
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Logo />

          <Label color="info" sx={{ ml: 1 }}>
            TS v2.8.0
          </Label>
          <Box sx={{ flexGrow: 1 }} />

          {isDesktop && (
            <MenuDesktop isOffset={isOffset} navConfig={navConfig} />
          )}

          <Button
            variant="contained"
            href={`https://github.com/login/oauth/authorize?scope=user&client_id=${
              import.meta.env.VITE_CLIENT_ID
            }&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`}
          >
            GitHub Login
          </Button>

          {!isDesktop && (
            <MenuMobile isOffset={isOffset} navConfig={navConfig} />
          )}
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  )
}
