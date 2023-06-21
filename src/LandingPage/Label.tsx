import type { BoxProps } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { alpha, useTheme, styled } from '@mui/material/styles'

import type { ColorSchema } from './palette'

type LabelColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

type LabelVariant = 'filled' | 'outlined' | 'ghost'

const RootStyle = styled('span')(
  ({
    theme,
    ownerState,
  }: {
    theme: Theme
    ownerState: {
      color: LabelColor
      variant: LabelVariant
    }
  }) => {
    const isLight = theme.palette.mode === 'light'
    const { color, variant } = ownerState

    const styleFilled = (color: ColorSchema) => ({
      backgroundColor: theme.palette[color].main,
      color: theme.palette[color].contrastText,
    })

    const styleOutlined = (color: ColorSchema) => ({
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette[color].main}`,
      color: theme.palette[color].main,
    })

    const styleGhost = (color: ColorSchema) => ({
      backgroundColor: alpha(theme.palette[color].main, 0.16),
      color: theme.palette[color][isLight ? 'dark' : 'light'],
    })

    return {
      alignItems: 'center',
      backgroundColor: theme.palette.grey[300],
      borderRadius: 6,
      color: theme.palette.grey[800],
      cursor: 'default',
      display: 'inline-flex',
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      fontWeight: theme.typography.fontWeightBold,
      height: 22,
      justifyContent: 'center',
      lineHeight: 0,
      minWidth: 22,
      padding: theme.spacing(0, 1),
      whiteSpace: 'nowrap',

      ...(color !== 'default'
        ? {
            ...(variant === 'filled' && { ...styleFilled(color) }),
            ...(variant === 'outlined' && { ...styleOutlined(color) }),
            ...(variant === 'ghost' && { ...styleGhost(color) }),
          }
        : {
            ...(variant === 'outlined' && {
              backgroundColor: 'transparent',
              border: `1px solid ${theme.palette.grey[500_32]}`,
              color: theme.palette.text.primary,
            }),
            ...(variant === 'ghost' && {
              backgroundColor: theme.palette.grey[500_16],
              color: isLight
                ? theme.palette.text.secondary
                : theme.palette.common.white,
            }),
          }),
    }
  }
)

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  color?: LabelColor
  variant?: LabelVariant
}

export default function Label({
  color = 'default',
  variant = 'ghost',
  children,
  sx,
}: Props) {
  const theme = useTheme()

  return (
    <RootStyle ownerState={{ color, variant }} sx={sx} theme={theme}>
      {children}
    </RootStyle>
  )
}
