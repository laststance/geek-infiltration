import type { FabProps, SxProps } from '@mui/material'
import { Box, Fab } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { m } from 'framer-motion'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'
// @mui

// ----------------------------------------------------------------------

interface Props extends Omit<FabProps, 'color'> {
  sxWrap?: SxProps
  color?:
    | 'inherit'
    | 'default'
    | 'primary'
    | 'secondary'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
}

const FabButtonAnimate = forwardRef<HTMLButtonElement, Props>(
  (
    { color = 'primary', size = 'large', children, sx, sxWrap, ...other },
    ref
  ) => {
    const theme = useTheme()

    if (
      color === 'default' ||
      color === 'inherit' ||
      color === 'primary' ||
      color === 'secondary'
    ) {
      return (
        <AnimateWrap size={size} sxWrap={sxWrap}>
          <Fab ref={ref} size={size} color={color} sx={sx} {...other}>
            {children}
          </Fab>
        </AnimateWrap>
      )
    }

    return (
      <AnimateWrap size={size} sxWrap={sxWrap}>
        <Fab
          ref={ref}
          size={size}
          sx={{
            '&:hover': {
              bgcolor: theme.palette[color].dark,
            },
            bgcolor: theme.palette[color].main,
            boxShadow: theme.customShadows[color],
            color: theme.palette[color].contrastText,
            ...sx,
          }}
          {...other}
        >
          {children}
        </Fab>
      </AnimateWrap>
    )
  }
)
FabButtonAnimate.displayName = 'FabButtonAnimate'

export default FabButtonAnimate

// ----------------------------------------------------------------------

type AnimateWrapProp = {
  children: ReactNode
  size: 'small' | 'medium' | 'large'
  sxWrap?: SxProps
}

const varSmall = {
  hover: { scale: 1.07 },
  tap: { scale: 0.97 },
}

const varMedium = {
  hover: { scale: 1.06 },
  tap: { scale: 0.98 },
}

const varLarge = {
  hover: { scale: 1.05 },
  tap: { scale: 0.99 },
}

function AnimateWrap({ size, children, sxWrap }: AnimateWrapProp) {
  const isSmall = size === 'small'
  const isLarge = size === 'large'

  return (
    <Box
      component={m.div}
      whileTap="tap"
      whileHover="hover"
      variants={(isSmall && varSmall) || (isLarge && varLarge) || varMedium}
      sx={{
        display: 'inline-flex',
        ...sxWrap,
      }}
    >
      {children}
    </Box>
  )
}
