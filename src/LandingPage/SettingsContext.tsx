import type { ReactNode } from 'react'
import { createContext } from 'react'

import { defaultSettings } from './config'
import getColorPresets, { colorPresets, defaultPreset } from './getColorPresets'
import type {
  SettingsContextProps,
  ThemeColorPresets,
  ThemeDirection,
  ThemeMode,
} from './type'
import useLocalStorage from './useLocalStorage'

// ----------------------------------------------------------------------

const initialState: SettingsContextProps = {
  ...defaultSettings,
  colorOption: [],
  onChangeColor: () => {},
  onChangeDirection: () => {},
  onChangeMode: () => {},
  onResetSetting: () => {},
  onToggleMode: () => {},
  onToggleStretch: () => {},
  setColor: defaultPreset,
}

const SettingsContext = createContext(initialState)

type SettingsProviderProps = {
  children: ReactNode
}

function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useLocalStorage('settings', {
    themeColorPresets: initialState.themeColorPresets,
    themeDirection: initialState.themeDirection,
    themeMode: initialState.themeMode,
    themeStretch: initialState.themeStretch,
  })

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    })
  }

  const onToggleMode = () => {
    setSettings({
      ...settings,
      themeMode: settings.themeMode === 'light' ? 'dark' : 'light',
    })
  }

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeDirection: (event.target as HTMLInputElement)
        .value as ThemeDirection,
    })
  }

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColorPresets: (event.target as HTMLInputElement)
        .value as ThemeColorPresets,
    })
  }

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    })
  }

  const onResetSetting = () => {
    setSettings({
      themeColorPresets: initialState.themeColorPresets,
      themeDirection: initialState.themeDirection,
      themeMode: initialState.themeMode,
      themeStretch: initialState.themeStretch,
    })
  }

  return (
    <SettingsContext.Provider
      value={{
        ...settings,

        colorOption: colorPresets.map((color) => ({
          name: color.name,
          value: color.main,
        })),

        // Color
        onChangeColor,

        // Direction
        onChangeDirection,

        // Mode
        onChangeMode,
        // Reset Setting
        onResetSetting,

        onToggleMode,

        // Stretch
        onToggleStretch,

        setColor: getColorPresets(settings.themeColorPresets),
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export { SettingsProvider, SettingsContext }
