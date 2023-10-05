import type { IconifyIcon } from '@iconify/react'
import { Icon } from '@iconify/react'
import type { BoxProps, SxProps } from '@mui/material'
import { Box } from '@mui/material'

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  icon: IconifyIcon | string
  sx?: SxProps
}

export default function Iconify({ icon, sx, ...other }: Props) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />
}
