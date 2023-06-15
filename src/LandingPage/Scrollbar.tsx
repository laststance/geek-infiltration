import type { SxProps } from '@mui/material'
import { Box } from '@mui/material'
import { alpha, styled } from '@mui/material/styles'
import type { PropsWithChildren } from 'react'
import type { Props as ScrollbarProps } from 'simplebar-react'
import SimpleBarReact from 'simplebar-react'

// @mui

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  flexGrow: 1,
  height: '100%',
  overflow: 'hidden',
}))

const SimpleBarStyle = styled(SimpleBarReact)(({ theme }) => ({
  '& .simplebar-mask': {
    zIndex: 'inherit',
  },
  '& .simplebar-scrollbar': {
    '&.simplebar-visible:before': {
      opacity: 1,
    },
    '&:before': {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
  },
  '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
    height: 6,
  },
  '& .simplebar-track.simplebar-vertical': {
    width: 10,
  },
  maxHeight: '100%',
}))

// ----------------------------------------------------------------------

interface Props extends ScrollbarProps {
  sx?: SxProps
}

export default function Scrollbar({
  children,
  sx,
  ...other
}: PropsWithChildren<Props>) {
  const userAgent =
    typeof navigator === 'undefined' ? 'SSR' : navigator.userAgent

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    )

  if (isMobile) {
    return (
      <Box sx={{ overflowX: 'auto', ...sx }} {...other}>
        {children}
      </Box>
    )
  }

  return (
    <RootStyle>
      {/* @ts-expect-error TODO */}
      <SimpleBarStyle timeout={500} clickOnTrack={false} sx={sx} {...other}>
        {children}
      </SimpleBarStyle>
    </RootStyle>
  )
}
