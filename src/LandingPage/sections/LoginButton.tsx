import { Button } from '@mui/material'
import type { SxProps, Theme } from '@mui/material'

import { GITHUB_AUTH_ENDPOINT } from '../../constants/endpoint'
import Iconify from '../Iconify'

import { LANDING, LANDING_FONT_SANS } from './tokens'

interface LoginButtonProps {
  /** Visual weight: 'accent' = green outline (hero/CTA), 'neutral' = grey outline (header). */
  tone?: 'accent' | 'neutral'
  /** MUI size passthrough (default 'large'). */
  size?: 'small' | 'medium' | 'large'
  sx?: SxProps<Theme>
}

/**
 * The landing's single call-to-action: an anchor button that hands off to the
 * server-owned GitHub OAuth start route. Repeated only in header, hero, and final
 * band; styled once here so every instance matches and stays keyboard-focusable.
 * @param tone - 'accent' green outline or 'neutral' grey outline (default 'accent').
 * @param size - MUI button size (default 'large').
 * @returns An `<a>`-rendered outlined button beginning same-origin OAuth on activation.
 * @example <LoginButton tone="neutral" size="medium" />
 */
export default function LoginButton({
  tone = 'accent',
  size = 'large',
  sx,
}: LoginButtonProps) {
  const isAccent = tone === 'accent'

  return (
    <Button
      component="a"
      href={GITHUB_AUTH_ENDPOINT}
      size={size}
      disableRipple
      startIcon={
        <Iconify icon="octicon:mark-github-16" sx={{ width: 18, height: 18 }} />
      }
      sx={[
        {
          fontFamily: LANDING_FONT_SANS,
          px: 2.5,
          py: size === 'large' ? 1.25 : 1,
          borderRadius: 1.5,
          color: LANDING.text,
          fontWeight: 600,
          letterSpacing: 0.2,
          textTransform: 'none',
          border: '1px solid',
          borderColor: isAccent ? LANDING.greenBorder : LANDING.border,
          bgcolor: isAccent ? LANDING.greenSoft : 'transparent',
          transition:
            'border-color .18s ease, background-color .18s ease, box-shadow .18s ease',
          '&:hover': {
            bgcolor: isAccent ? LANDING.greenHover : LANDING.greenSoft,
            borderColor: LANDING.green,
          },
          // Visible keyboard focus ring (a11y): green halo on focus-visible only.
          '&:focus-visible': {
            outline: 'none',
            borderColor: LANDING.green,
            boxShadow: `0 0 0 3px ${LANDING.greenFocusRing}`,
          },
        },
        // MUI SxProps can be an object, array, or callback; normalize to an array so a
        // caller's array/callback sx composes instead of being dropped by object spread.
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      Login with GitHub
    </Button>
  )
}
