export const GITHUB_AUTH_ENDPOINT = '/api/auth/github/start'
export const GITHUB_GRAPHQL_ENDPOINT = new URL(
  '/api/github/graphql',
  window.location.origin,
).toString()
