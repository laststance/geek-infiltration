// @mui
import type { PopoverProps } from '@mui/material'
import { Popover } from '@mui/material'
import { styled } from '@mui/material/styles'

// ----------------------------------------------------------------------

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    background: theme.palette.background.paper,
    borderBottom: `solid 1px ${theme.palette.grey[500_12]}`,
    borderRadius: '0 0 4px 0',
    borderRight: `solid 1px ${theme.palette.grey[500_12]}`,
    content: "''",
    height: 12,
    position: 'absolute',
    right: 20,
    top: -7,
    transform: 'rotate(-135deg)',
    width: 12,
    zIndex: 1,
  },
}))

export default function MenuPopover({ children, sx, ...other }: PopoverProps) {
  return (
    <Popover
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'bottom',
      }}
      transformOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      PaperProps={{
        sx: {
          border: (theme) => `solid 1px ${theme.palette.grey[500_12]}`,
          borderRadius: 1.5,
          boxShadow: (theme) => theme.customShadows.z20,
          ml: 0.5,
          mt: 1.5,
          overflow: 'inherit',
          width: 200,
          ...sx,
        },
      }}
      {...other}
    >
      <ArrowStyle />

      {children}
    </Popover>
  )
}
