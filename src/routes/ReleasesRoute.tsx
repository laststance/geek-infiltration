import { Stack, Typography } from '@mui/material'

/**
 * Reserves the authenticated Release Feed route before the data layer lands.
 * @returns The Release Feed placeholder route view.
 * @example
 * <Route path="/releases" Component={Component} />
 */
export function Component() {
  return (
    <Stack
      component="section"
      data-testid="release-feed-route"
      sx={{
        flex: 1,
        minWidth: 0,
        overflow: 'auto',
        padding: 3,
      }}
    >
      <Typography component="h1" variant="h4">
        Release Feed
      </Typography>
    </Stack>
  )
}
