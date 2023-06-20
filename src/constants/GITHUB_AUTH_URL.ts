export const GITHUB_AUTH_URL = `https://github.com/login/oauth/authorize?scope=user&client_id=${
  import.meta.env.VITE_CLIENT_ID
}&redirect_uri=${import.meta.env.VITE_REDIRECT_URI}`
