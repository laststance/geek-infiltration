import type { IconButtonProps } from '@mui/material'
import { Box, IconButton } from '@mui/material'
import { m } from 'framer-motion'
import type { ReactNode } from 'react'
// @mui

// ----------------------------------------------------------------------

interface Props extends IconButtonProps {
  ref?: React.Ref<HTMLButtonElement>
}

const IconButtonAnimate = ({
  children,
  ref,
  size = 'medium',
  ...other
}: Props) => (
  <AnimateWrap size={size}>
    <IconButton size={size} ref={ref} {...other}>
      {children}
    </IconButton>
  </AnimateWrap>
)
IconButtonAnimate.displayName = 'IconButtonAnimate'

export default IconButtonAnimate

// ----------------------------------------------------------------------

type AnimateWrapProp = {
  children: ReactNode
  size: 'small' | 'medium' | 'large'
}

const varSmall = {
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
}

const varMedium = {
  hover: { scale: 1.09 },
  tap: { scale: 0.97 },
}

const varLarge = {
  hover: { scale: 1.08 },
  tap: { scale: 0.99 },
}

function AnimateWrap({ children, size }: AnimateWrapProp) {
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
      }}
    >
      {children}
    </Box>
  )
}
