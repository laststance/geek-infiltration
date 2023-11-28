import { Typography } from '@mui/material'
import type { ComponentProps } from 'react'
import React, { memo } from 'react'

const Text: React.FC<ComponentProps<typeof Typography>> = memo(
  ({ children, ...rest }) => <Typography {...rest}>{children}</Typography>,
)
Text.displayName = 'Text'

export default Text
