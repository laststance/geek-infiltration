import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'

interface Props extends BoxProps {
  children: ReactNode
  ref?: React.Ref<HTMLDivElement>
}

const Page = ({ children, ref, ...other }: Props) => {
  return (
    <Box ref={ref} {...other}>
      {children}
    </Box>
  )
}
Page.displayName = 'Page'

export default Page
