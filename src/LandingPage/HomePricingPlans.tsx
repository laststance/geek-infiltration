import {
  Box,
  Card,
  Stack,
  Button,
  Container,
  Typography,
  Grid,
} from '@mui/material'
import { useTheme, styled } from '@mui/material/styles'

import { createGitHubAuthUrl } from '../constants/GITHUB_AUTH_URL'

import { MotionInView, varFade } from './animate'
import Iconify from './Iconify'

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
  const githubAuthUrl = createGitHubAuthUrl()

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
              workflow signals
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography variant="h2" sx={{ mb: 3 }}>
              Everything you need to follow GitHub work
            </Typography>
          </MotionInView>
          <MotionInView variants={varFade().inDown}>
            <Typography
              sx={{
                color: isLight ? 'text.secondary' : 'text.primary',
              }}
            >
              Connect once, choose subscriptions, and review activity from one
              authenticated dashboard.
            </Typography>
          </MotionInView>
        </Box>

        <Grid container spacing={5}>
          {_homePlans.map((plan) => (
            <Grid key={plan.title} size={{ xs: 12, md: 4 }}>
              <MotionInView
                variants={
                  plan.title === 'Timeline aggregation'
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
              <Typography variant="h3">Know what changed today</Typography>
            </MotionInView>

            <MotionInView variants={varFade().inDown}>
              <Typography sx={{ color: 'text.secondary', mb: 5, mt: 3 }}>
                Login with GitHub, add the developers or repositories you care
                about, and keep their activity visible without hunting through
                tabs.
              </Typography>
            </MotionInView>

            <MotionInView variants={varFade().inUp}>
              <Button size="large" variant="contained" href={githubAuthUrl}>
                Login with GitHub
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
    description: string
    icon: string
    points: string[]
    title: string
  }
}

function PlanCard({ plan }: PlanCardProps) {
  const { description, icon, points, title } = plan
  const highlighted = title === 'Timeline aggregation'
  const githubAuthUrl = createGitHubAuthUrl()

  return (
    <Card
      sx={{
        boxShadow: 0,
        p: 5,
        ...(highlighted && {
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
            FEATURE
          </Typography>
          <Typography variant="h4">{title}</Typography>
        </div>

        <Iconify
          icon={icon}
          sx={{ color: 'primary.main', height: 40, width: 40 }}
        />

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>

        <Stack spacing={2.5}>
          {points.map((option) => (
            <Stack
              key={option}
              spacing={1.5}
              direction="row"
              sx={{
                alignItems: 'center',
              }}
            >
              <Iconify
                icon={'eva:checkmark-fill'}
                sx={{ color: 'primary.main', height: 20, width: 20 }}
              />
              <Typography variant="body2">{option}</Typography>
            </Stack>
          ))}
        </Stack>

        <Button
          size="large"
          fullWidth
          variant={highlighted ? 'contained' : 'outlined'}
          href={githubAuthUrl}
          aria-label={`Login with GitHub for ${title}`}
        >
          Login with GitHub
        </Button>
      </Stack>
    </Card>
  )
}

const _homePlans = [
  {
    description: 'Collect the GitHub conversations that matter into one view.',
    icon: 'eva:layers-fill',
    points: [
      'Pull requests, issues, and discussions in one timeline',
      'Side-by-side columns for people or repositories',
      'Readable cards with author, source, and time',
    ],
    title: 'Timeline aggregation',
  },
  {
    description:
      'Use GitHub OAuth so the app can read the activity you follow.',
    icon: 'bytesize:github',
    points: [
      'One clear GitHub login entry point',
      'Authenticated requests through the existing GraphQL API',
      'No GitHub activity shown before login',
    ],
    title: 'GitHub login',
  },
  {
    description:
      'Pick the developers and repositories you want to keep nearby.',
    icon: 'eva:bell-fill',
    points: [
      'Subscribe to developers or repositories',
      'Choose PR/Issue or Discussion feeds',
      'Remove timelines when they are no longer useful',
    ],
    title: 'Subscriptions',
  },
]
