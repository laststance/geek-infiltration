import {
  Box,
  Stack,
  Radio,
  Tooltip,
  Container,
  Typography,
  RadioGroup,
  CardActionArea,
  FormControlLabel,
} from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import { capitalCase } from 'change-case'
import { m } from 'framer-motion'

// @mui
// hooks
import { MotionInView, varFade } from './animate'
import Image from './Image'
import useSettings from './useSettings'
// components

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(15, 0),
}))

// ----------------------------------------------------------------------

export function HomeColorPresets() {
  const { themeColorPresets, onChangeColor, colorOption } = useSettings()

  return (
    <RootStyle>
      <Container sx={{ position: 'relative', textAlign: 'center' }}>
        <MotionInView variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled', mb: 2 }}
          >
            choose your style
          </Typography>
        </MotionInView>

        <MotionInView variants={varFade().inUp}>
          <Typography variant="h2" sx={{ mb: 3 }}>
            Color presets
          </Typography>
        </MotionInView>

        <MotionInView variants={varFade().inUp}>
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === 'light'
                  ? 'text.secondary'
                  : 'text.primary',
            }}
          >
            Express your own style with just one click.
          </Typography>
        </MotionInView>

        <RadioGroup
          name="themeColorPresets"
          value={themeColorPresets}
          onChange={onChangeColor}
          sx={{ my: 5 }}
        >
          <Stack
            direction={{ lg: 'column', xs: 'row' }}
            justifyContent="center"
            spacing={1}
            sx={{
              position: { lg: 'absolute' },
              right: { lg: 0 },
            }}
          >
            {colorOption.map((color) => {
              const colorName = color.name
              const colorValue = color.value
              const isSelected = themeColorPresets === colorName

              return (
                <Tooltip
                  key={colorName}
                  title={capitalCase(colorName)}
                  placement="right"
                >
                  <CardActionArea
                    sx={{
                      borderRadius: '50%',
                      color: colorValue,
                      height: 32,
                      width: 32,
                    }}
                  >
                    <Box
                      sx={{
                        alignItems: 'center',
                        borderRadius: '50%',
                        display: 'flex',
                        height: 1,
                        justifyContent: 'center',
                        width: 1,
                        ...(isSelected && {
                          borderColor: alpha(colorValue, 0.24),
                          borderStyle: 'solid',
                          borderWidth: 4,
                        }),
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: colorValue,
                          borderRadius: '50%',
                          height: 10,
                          width: 10,
                          ...(isSelected && {
                            height: 14,
                            transition: (theme) =>
                              theme.transitions.create('all', {
                                duration: theme.transitions.duration.shorter,
                                easing: theme.transitions.easing.easeInOut,
                              }),
                            width: 14,
                          }),
                        }}
                      />
                      <FormControlLabel
                        label=""
                        value={colorName}
                        control={<Radio sx={{ display: 'none' }} />}
                        sx={{
                          height: 1,
                          left: 0,
                          margin: 0,
                          position: 'absolute',
                          top: 0,
                          width: 1,
                        }}
                      />
                    </Box>
                  </CardActionArea>
                </Tooltip>
              )
            })}
          </Stack>
        </RadioGroup>

        <Box sx={{ position: 'relative' }}>
          <Image
            disabledEffect
            alt="grid"
            src="https://minimal-assets-api.vercel.app/assets/images/home/theme-color/grid.png"
          />

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFade().inUp}>
              <Image
                disabledEffect
                alt="screen"
                src={`https://minimal-assets-api.vercel.app/assets/images/home/theme-color/screen-${themeColorPresets}.png`}
              />
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFade().inDown}>
              <m.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <Image
                  disabledEffect
                  alt="sidebar"
                  src={`https://minimal-assets-api.vercel.app/assets/images/home/theme-color/block1-${themeColorPresets}.png`}
                />
              </m.div>
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFade().inDown}>
              <m.div
                animate={{ y: [-5, 10, -5] }}
                transition={{ duration: 8, repeat: Infinity }}
              >
                <Image
                  disabledEffect
                  alt="sidebar"
                  src={`https://minimal-assets-api.vercel.app/assets/images/home/theme-color/block2-${themeColorPresets}.png`}
                />
              </m.div>
            </MotionInView>
          </Box>

          <Box sx={{ position: 'absolute', top: 0 }}>
            <MotionInView variants={varFade().inDown}>
              <m.div
                animate={{ y: [-25, 5, -25] }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                <Image
                  disabledEffect
                  alt="sidebar"
                  src={`https://minimal-assets-api.vercel.app/assets/images/home/theme-color/sidebar-${themeColorPresets}.png`}
                />
              </m.div>
            </MotionInView>
          </Box>
        </Box>
      </Container>
    </RootStyle>
  )
}
