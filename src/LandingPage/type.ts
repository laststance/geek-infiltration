import type { ReactElement } from 'react'

export type MenuItemProps = {
  title: string
  children?: {
    items: {
      title: string
      path: string
    }[]
    subheader: string
  }[]
  icon?: ReactElement<unknown>
  path: string
  to?: string
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
  contrastText: string
  dark: string
  darker: string
  light: string
  lighter: string
  main: string
}
export type SettingsValueProps = {
  themeColorPresets: ThemeColorPresets
  themeDirection: ThemeDirection
  themeMode: ThemeMode
  themeStretch: ThemeStretch
}
export type SettingsContextProps = {
  colorOption: {
    name: string
    value: string
  }[]
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void
  onResetSetting: VoidFunction
  onToggleMode: VoidFunction
  onToggleStretch: VoidFunction
  setColor: ColorVariants
  themeColorPresets: ThemeColorPresets
  themeDirection: ThemeDirection
  themeMode: ThemeMode
  themeStretch: boolean
}
