import { Box, IconButton, AppBar, Toolbar, Container } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'

import { GITHUB_AUTH_URL } from '../constants/GITHUB_AUTH_URL'
import useOffSetTop from '../hooks/useOffSetTop'

import { MAIN_HEADER_DESKTOP } from './config'
import cssStyles from './cssStyles'
import Iconify from './Iconify'

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: MAIN_HEADER_DESKTOP,
  transition: theme.transitions.create(['height', 'background-color'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
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

export default function MainHeader() {
  const isOffset = useOffSetTop(MAIN_HEADER_DESKTOP)

  const theme = useTheme()

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
          <Box sx={{ flexGrow: 1 }} />

          <IconButton
            href={GITHUB_AUTH_URL}
            sx={{
              backgroundColor: 'black',
              borderRadius: '10px',
              color: 'white',

              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '24px',
              paddingBottom: '8px',
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '8px',
            }}
          >
            <Iconify
              icon="bytesize:github"
              sx={{ lineHeight: '24px', marginRight: '8px' }}
            />
            Login with GitHub
          </IconButton>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  )
}
