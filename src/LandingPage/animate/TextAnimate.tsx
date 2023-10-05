import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { MotionProps } from 'framer-motion'
import { m } from 'framer-motion'
// @mui

//
import { varFade } from './variants'

// ----------------------------------------------------------------------

type Props = BoxProps & MotionProps

interface TextAnimateProps extends Props {
  text: string
}

export default function TextAnimate({
  sx,
  text,
  variants,
  ...other
}: TextAnimateProps) {
  return (
    <Box
      component={m.h1}
      sx={{
        display: 'inline-flex',
        overflow: 'hidden',
        typography: 'h1',
        ...sx,
      }}
      {...other}
    >
      {text.split('').map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  )
}
