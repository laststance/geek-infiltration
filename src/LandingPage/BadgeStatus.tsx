// @mui
import type { BoxProps } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useTheme, styled } from '@mui/material/styles'

// ----------------------------------------------------------------------

type BadgeStatusEnum =
  | 'away'
  | 'busy'
  | 'unread'
  | 'online'
  | 'offline'
  | 'invisible'
  | string

type BadgeSize = 'small' | 'medium' | 'large'

const RootStyle = styled('span')(
  ({
    theme,
    ownerState,
  }: {
    theme: Theme
    ownerState: {
      size: BadgeSize
      status: BadgeStatusEnum
    }
  }) => {
    const { status, size } = ownerState

    return {
      '&:before, &:after': {
        backgroundColor: theme.palette.common.white,
        borderRadius: 1,
        content: "''",
      },
      alignItems: 'center',
      borderRadius: '50%',
      display: 'flex',
      height: 10,
      justifyContent: 'center',
      width: 10,

      ...(size === 'small' && { height: 8, width: 8 }),

      ...(size === 'large' && { height: 12, width: 12 }),

      ...(status === 'offline' && { backgroundColor: 'transparent' }),

      ...(status === 'away' && {
        '&:after': {
          height: 4,
          transform: 'translateY(1px) rotate(125deg)',
          width: 2,
        },
        '&:before': {
          height: 4,
          transform: 'translateX(1px) translateY(-1px)',
          width: 2,
        },
        backgroundColor: theme.palette.warning.main,
      }),

      ...(status === 'busy' && {
        '&:before': { height: 2, width: 6 },
        backgroundColor: theme.palette.error.main,
      }),

      ...(status === 'online' && {
        backgroundColor: theme.palette.success.main,
      }),

      ...(status === 'invisible' && {
        '&:before': {
          borderRadius: '50%',
          height: 6,
          width: 6,
        },
        backgroundColor: theme.palette.text.disabled,
      }),

      ...(status === 'unread' && {
        backgroundColor: theme.palette.info.main,
      }),
    }
  }
)

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  size?: BadgeSize
  status?: BadgeStatusEnum
}

export default function BadgeStatus({
  size = 'medium',
  status = 'offline',
  sx,
}: Props) {
  const theme = useTheme()

  return <RootStyle ownerState={{ size, status }} sx={sx} theme={theme} />
}
