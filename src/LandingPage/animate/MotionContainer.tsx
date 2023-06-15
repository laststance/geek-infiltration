import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { MotionProps } from 'framer-motion'
import { m } from 'framer-motion'
// @mui

//
import { varContainer } from './variants'

// ----------------------------------------------------------------------

type IProps = BoxProps & MotionProps

export interface Props extends IProps {
  animate?: boolean
  action?: boolean
}

export default function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}: Props) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? 'animate' : 'exit'}
        variants={varContainer()}
        {...other}
      >
        {children}
      </Box>
    )
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  )
}
