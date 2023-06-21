import { alpha } from '@mui/material/styles'

function createGradient(color1: string, color2: string) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`
}

export type ColorSchema =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

interface GradientsPaletteOptions {
  primary: string
  info: string
  success: string
  warning: string
  error: string
}

interface ChartPaletteOptions {
  violet: string[]
  blue: string[]
  green: string[]
  yellow: string[]
  red: string[]
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    neutral: string
  }
  interface SimplePaletteColorOptions {
    lighter: string
    darker: string
  }
  interface PaletteColor {
    lighter: string
    darker: string
  }
  interface Palette {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }
  interface PaletteOptions {
    gradients: GradientsPaletteOptions
    chart: ChartPaletteOptions
  }
}

declare module '@mui/material' {
  interface Color {
    0: string
    500_8: string
    500_12: string
    500_16: string
    500_24: string
    500_32: string
    500_48: string
    500_56: string
    500_80: string
  }
}

// SETUP COLORS
const PRIMARY = {
  dark: '#007B55',
  darker: '#005249',
  light: '#5BE584',
  lighter: '#C8FACD',
  main: '#00AB55',
}
const SECONDARY = {
  dark: '#1939B7',
  darker: '#091A7A',
  light: '#84A9FF',
  lighter: '#D6E4FF',
  main: '#3366FF',
}
const INFO = {
  dark: '#0C53B7',
  darker: '#04297A',
  light: '#74CAFF',
  lighter: '#D0F2FF',
  main: '#1890FF',
}
const SUCCESS = {
  dark: '#229A16',
  darker: '#08660D',
  light: '#AAF27F',
  lighter: '#E9FCD4',
  main: '#54D62C',
}
const WARNING = {
  dark: '#B78103',
  darker: '#7A4F01',
  light: '#FFE16A',
  lighter: '#FFF7CD',
  main: '#FFC107',
}
const ERROR = {
  dark: '#B72136',
  darker: '#7A0C2E',
  light: '#FFA48D',
  lighter: '#FFE7D9',
  main: '#FF4842',
}

const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_8: alpha('#919EAB', 0.08),
  500_80: alpha('#919EAB', 0.8),
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
}

const GRADIENTS = {
  error: createGradient(ERROR.light, ERROR.main),
  info: createGradient(INFO.light, INFO.main),
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
}

const CHART_COLORS = {
  blue: ['#2D99FF', '#83CFFF', '#A5F3FF', '#CCFAFF'],
  green: ['#2CD9C5', '#60F1C8', '#A4F7CC', '#C0F2DC'],
  red: ['#FF6C40', '#FF8F6D', '#FFBD98', '#FFF2D4'],
  violet: ['#826AF9', '#9E86FF', '#D0AEFF', '#F7D2FF'],
  yellow: ['#FFE700', '#FFEF5A', '#FFF7AE', '#FFF3D6'],
}

const COMMON = {
  action: {
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    disabledOpacity: 0.48,
    focus: GREY[500_24],
    hover: GREY[500_8],
    hoverOpacity: 0.08,
    selected: GREY[500_16],
  },
  chart: CHART_COLORS,
  common: { black: '#000', white: '#fff' },
  divider: GREY[500_24],
  error: { ...ERROR, contrastText: '#fff' },
  gradients: GRADIENTS,
  grey: GREY,
  info: { ...INFO, contrastText: '#fff' },
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#fff' },
  success: { ...SUCCESS, contrastText: GREY[800] },
  warning: { ...WARNING, contrastText: GREY[800] },
}

const palette = {
  dark: {
    ...COMMON,
    action: { active: GREY[500], ...COMMON.action },
    background: { default: GREY[900], neutral: GREY[500_16], paper: GREY[800] },
    mode: 'dark',
    text: { disabled: GREY[600], primary: '#fff', secondary: GREY[500] },
  },
  light: {
    ...COMMON,
    action: { active: GREY[600], ...COMMON.action },
    background: { default: '#fff', neutral: GREY[200], paper: '#fff' },
    mode: 'light',
    text: { disabled: GREY[500], primary: GREY[800], secondary: GREY[600] },
  },
} as const

export default palette
