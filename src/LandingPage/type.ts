import type { ReactElement } from 'react'

// ----------------------------------------------------------------------

export type MenuItemProps = {
  title: string
  path: string
  icon?: ReactElement
  to?: string
  children?: {
    subheader: string
    items: {
      title: string
      path: string
    }[]
  }[]
}

export type MenuProps = {
  isOffset: boolean
  navConfig: MenuItemProps[]
}
export type ThemeMode = 'light' | 'dark'
export type ThemeDirection = 'rtl' | 'ltr'
export type ThemeColorPresets =
  | 'default'
  | 'purple'
  | 'cyan'
  | 'blue'
  | 'orange'
  | 'red'
export type ThemeStretch = boolean
type ColorVariants = {
  name: string
  lighter: string
  light: string
  main: string
  dark: string
  darker: string
  contrastText: string
}
export type SettingsValueProps = {
  themeMode: ThemeMode
  themeDirection: ThemeDirection
  themeColorPresets: ThemeColorPresets
  themeStretch: ThemeStretch
}
export type SettingsContextProps = {
  themeMode: ThemeMode
  themeDirection: ThemeDirection
  themeColorPresets: ThemeColorPresets
  themeStretch: boolean
  setColor: ColorVariants
  colorOption: {
    name: string
    value: string
  }[]
  onToggleMode: VoidFunction
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void
  onToggleStretch: VoidFunction
  onResetSetting: VoidFunction
}
