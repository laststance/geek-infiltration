import type { BoxProps } from '@mui/material'
import type { ReactElement } from 'react'

// ----------------------------------------------------------------------

export type NavListProps = {
  title: string
  path: string
  icon?: ReactElement
  info?: ReactElement
  children?: {
    title: string
    path: string
    children?: { title: string; path: string }[]
  }[]
}

export type NavItemProps = {
  item: NavListProps
  isCollapse: boolean
  active: boolean
  open?: boolean
  onOpen?: VoidFunction
}

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean
  navConfig: {
    subheader: string
    items: NavListProps[]
  }[]
}
