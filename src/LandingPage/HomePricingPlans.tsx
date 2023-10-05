import {
  Box,
  Grid,
  Card,
  Link,
  Stack,
  Button,
  Divider,
  Container,
  Typography,
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

import { MotionInView, varFade } from './animate'
import Iconify from './Iconify'
import Image from './Image'

const RootStyle = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.neutral,
  padding: theme.spacing(10, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(15, 0),
  },
}))

export function HomePricingPlans() {
  const theme = useTheme()
  const isLight = theme.palette.mode === 'light'

  return (
    <RootStyle>
      <Container>
        <Box sx={{ mb: 10, textAlign: 'center' }}>
          <MotionInView variants={varFade().inUp}>
            <Typography
              component="div"
              variant="overline"
              sx={{ color: 'text.disabled', mb: 2 }}
            >
              pricing plans
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              The right plan for your business
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography
              sx={{
                color: isLight ? 'text.secondary' : 'text.primary',
              }}
            >
              Choose the perfect plan for your needs. Always flexible to grow
            </Typography>
          </MotionInView>
        </Box>

        <Grid container spacing={5}>
          {_homePlans.map((plan) => (
            <Grid key={plan.license} item xs={12} md={4}>
              <MotionInView
                variants={
                  plan.license === 'Standard Plus'
                    ? varFade().inDown
                    : varFade().inUp
                }
              >
                <PlanCard plan={plan} />
              </MotionInView>
            </Grid>
          ))}
        </Grid>

        <MotionInView variants={varFade().in}>
          <Box sx={{ mt: 10, p: 5, textAlign: 'center' }}>
            <MotionInView variants={varFade().inDown}>
              <Typography variant="h3">Still have questions?</Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Typography sx={{ color: 'text.secondary', mb: 5, mt: 3 }}>
                Please describe your case to receive the most accurate advice.
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inUp}>
              <Button
                size="large"
                variant="contained"
                href="mailto:support@minimals.cc?subject=[Feedback] from Customer"
              >
                Contact us
              </Button>
            </MotionInView>
          </Box>
        </MotionInView>
      </Container>
    </RootStyle>
  )
}

type PlanCardProps = {
  plan: {
    commons: string[]
    icons: string[]
    license: string
    options: string[]
  }
}

function PlanCard({ plan }: PlanCardProps) {
  const { commons, icons, license, options } = plan

  const standard = license === 'Standard'
  const plus = license === 'Standard Plus'

  return (
    <Card
      sx={{
        boxShadow: 0,
        p: 5,
        ...(plus && {
          boxShadow: (theme) => theme.customShadows.z24,
        }),
      }}
    >
      <Stack spacing={5}>
        <div>
          <Typography
            variant="overline"
            component="div"
            sx={{ color: 'text.disabled', mb: 2 }}
          >
            LICENSE
          </Typography>
          <Typography variant="h4">{license}</Typography>
        </div>

        {standard ? (
          <Image src={icons[2]} sx={{ height: 40, width: 40 }} />
        ) : (
          <Stack direction="row" spacing={1}>
            {icons.map((icon) => (
              <Image key={icon} src={icon} sx={{ height: 40, width: 40 }} />
            ))}
          </Stack>
        )}

        <Stack spacing={2.5}>
          {commons.map((option) => (
            <Stack
              key={option}
              spacing={1.5}
              direction="row"
              alignItems="center"
            >
              <Iconify
                icon={'eva:checkmark-fill'}
                sx={{ color: 'primary.main', height: 20, width: 20 }}
              />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))}

          <Divider sx={{ borderStyle: 'dashed' }} />

          {options.map((option, optionIndex) => {
            const disabledLine =
              (standard && optionIndex === 1) ||
              (standard && optionIndex === 2) ||
              (standard && optionIndex === 3) ||
              (plus && optionIndex === 3)

            return (
              <Stack
                spacing={1.5}
                direction="row"
                alignItems="center"
                sx={{
                  ...(disabledLine && { color: 'text.disabled' }),
                }}
                key={option}
              >
                <Iconify
                  icon={'eva:checkmark-fill'}
                  sx={{
                    color: 'primary.main',
                    height: 20,
                    width: 20,
                    ...(disabledLine && { color: 'text.disabled' }),
                  }}
                />
                <Typography variant="body2">{option}</Typography>
              </Stack>
            )
          })}
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          <Link
            color="text.secondary"
            underline="always"
            target="_blank"
            rel="noopener"
            href="https://material-ui.com/store/license/#i-standard-license"
            sx={{ alignItems: 'center', display: 'flex', typography: 'body2' }}
          >
            Learn more{' '}
            <Iconify icon={'eva:chevron-right-fill'} width={20} height={20} />
          </Link>
        </Stack>

        <Button
          size="large"
          fullWidth
          variant={plus ? 'contained' : 'outlined'}
          target="_blank"
          rel="noopener"
          href="https://material-ui.com/store/items/minimal-dashboard/"
        >
          Choose Plan
        </Button>
      </Stack>
    </Card>
  )
}

const LICENSES = ['Standard', 'Standard Plus', 'Extended']

const _homePlans = [...Array(3)].map((_, index) => ({
  commons: ['One end products', '12 months updates', '6 months of support'],
  icons: [
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_sketch.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_figma.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_js.svg',
    'https://minimal-assets-api.vercel.app/assets/images/home/ic_ts.svg',
  ],
  license: LICENSES[index],
  options: [
    'JavaScript version',
    'TypeScript version',
    'Design Resources',
    'Commercial applications',
  ],
}))
