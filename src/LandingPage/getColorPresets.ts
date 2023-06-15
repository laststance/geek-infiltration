import palette from './palette'
import type { ThemeColorPresets } from './type'

// ----------------------------------------------------------------------

export const colorPresets = [
  // DEFAULT
  {
    name: 'default',
    ...palette.light.primary,
  },
  // PURPLE
  {
    contrastText: '#fff',
    dark: '#431A9E',
    darker: '#200A69',
    light: '#B985F4',
    lighter: '#EBD6FD',
    main: '#7635dc',
    name: 'purple',
  },
  // CYAN
  {
    contrastText: palette.light.grey[800],
    dark: '#0E77B7',
    darker: '#053D7A',
    light: '#76F2FF',
    lighter: '#D1FFFC',
    main: '#1CCAFF',
    name: 'cyan',
  },
  // BLUE
  {
    contrastText: '#fff',
    dark: '#0027B7',
    darker: '#00137A',
    light: '#6697FF',
    lighter: '#CCDFFF',
    main: '#0045FF',
    name: 'blue',
  },
  // ORANGE
  {
    contrastText: palette.light.grey[800],
    dark: '#B66816',
    darker: '#793908',
    light: '#FED680',
    lighter: '#FEF4D4',
    main: '#fda92d',
    name: 'orange',
  },
  // RED
  {
    contrastText: '#fff',
    dark: '#B71833',
    darker: '#7A0930',
    light: '#FFC1AC',
    lighter: '#FFE3D5',
    main: '#FF3030',
    name: 'red',
  },
]

export const defaultPreset = colorPresets[0]
export const purplePreset = colorPresets[1]
export const cyanPreset = colorPresets[2]
export const bluePreset = colorPresets[3]
export const orangePreset = colorPresets[4]
export const redPreset = colorPresets[5]

export default function getColorPresets(presetsKey: ThemeColorPresets) {
  return {
    blue: bluePreset,
    cyan: cyanPreset,
    default: defaultPreset,
    orange: orangePreset,
    purple: purplePreset,
    red: redPreset,
  }[presetsKey]
}
