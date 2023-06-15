// @mui
import type { ButtonProps, IconButtonProps } from '@mui/material'
import { Link, Stack, Button, Tooltip, IconButton } from '@mui/material'
import { alpha } from '@mui/material/styles'

//
import Iconify from './Iconify'

// ----------------------------------------------------------------------

export type SocialLinks = {
  facebook?: string
  instagram?: string
  linkedin?: string
  twitter?: string
}

type IProps = IconButtonProps & ButtonProps

interface Props extends IProps {
  simple?: boolean
  initialColor?: boolean
  links?: SocialLinks
}

export default function SocialsButton({
  initialColor = false,
  simple = true,
  links = {},
  sx,
  ...other
}: Props) {
  const SOCIALS = [
    {
      icon: 'eva:facebook-fill',
      name: 'FaceBook',
      path: links.facebook || '#facebook-link',
      socialColor: '#1877F2',
    },
    {
      icon: 'ant-design:instagram-filled',
      name: 'Instagram',
      path: links.instagram || '#instagram-link',
      socialColor: '#E02D69',
    },
    {
      icon: 'eva:linkedin-fill',
      name: 'Linkedin',
      path: links.linkedin || '#linkedin-link',
      socialColor: '#007EBB',
    },
    {
      icon: 'eva:twitter-fill',
      name: 'Twitter',
      path: links.twitter || '#twitter-link',
      socialColor: '#00AAEC',
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
