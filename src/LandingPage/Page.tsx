import type { BoxProps } from '@mui/material'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { forwardRef } from 'react'

interface Props extends BoxProps {
  children: ReactNode
}

const Page = forwardRef<HTMLDivElement, Props>(
  ({ children, ...other }, ref) => {
    return (
      <Box ref={ref} {...other}>
        {children}
      </Box>
    )
  }
)
Page.displayName = 'Page'

export default Page
