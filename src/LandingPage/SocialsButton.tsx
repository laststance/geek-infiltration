import type { ButtonProps, IconButtonProps } from '@mui/material'
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'

import Iconify from './Iconify'

type IProps = IconButtonProps & ButtonProps

interface Props extends IProps {
  simple?: boolean
  initialColor?: boolean
}

export default function SocialsButton({
  initialColor = false,
  simple = true,
  sx,
  ...other
}: Props) {
  const SOCIALS = [
    {
      icon: 'eva:github-fill',
      name: 'Github',
      path: 'https://github.com/laststance/geek-infiltration',
      socialColor: 'black',
    },
  ]

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center">
      {SOCIALS.map((social) => {
        const { name, icon, path, socialColor } = social
        return simple ? (
          <Link key={name} href={path}>
            <Tooltip title={name} placement="top">
              <IconButton
                color="inherit"
                size="large"
                sx={{
                  ...(initialColor && {
                    '&:hover': {
                      bgcolor: alpha(socialColor, 0.08),
                    },
                    color: socialColor,
                  }),
                  ...sx,
                }}
                {...other}
              >
                <Iconify icon={icon} sx={{ height: 20, width: 20 }} />
              </IconButton>
            </Tooltip>
          </Link>
        ) : (
          <Button
            key={name}
            href={path}
            color="inherit"
            variant="outlined"
            size="small"
            startIcon={<Iconify icon={icon} />}
            sx={{
              flexShrink: 0,
              m: 0.5,
              ...(initialColor && {
                '&:hover': {
                  bgcolor: alpha(socialColor, 0.08),
                  borderColor: socialColor,
                },
                borderColor: socialColor,
                color: socialColor,
              }),
              ...sx,
            }}
            {...other}
          >
            {name}
          </Button>
        )
      })}
    </Stack>
  )
}
