export const GITHUB_OAUTH_AUTHORIZE_URL =
  'https://github.com/login/oauth/authorize'
export const GITHUB_OAUTH_TOKEN_URL =
  'https://github.com/login/oauth/access_token'
export const GITHUB_GRAPHQL_API_URL = 'https://api.github.com/graphql'
export const GITHUB_OAUTH_SCOPE = 'user'
export const OAUTH_CALLBACK_PATH = '/api/auth/github/callback'
export const OAUTH_START_PATH = '/api/auth/github/start'
export const DEFAULT_AUTHENTICATED_PATH = '/app'
export const SESSION_COOKIE_NAME = '__Host-geek-infiltration-session'
export const SESSION_STORAGE_KEY_PREFIX = 'geek-infiltration:session:'
export const OAUTH_TRANSACTION_COOKIE_NAME = '__Host-geek-infiltration-oauth'
export const OAUTH_TRANSACTION_MAX_AGE_SECONDS = 10 * 60
export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60
export const GITHUB_REQUEST_TIMEOUT_MS = 10_000
export const SESSION_SECRET_MINIMUM_LENGTH = 32
export const RANDOM_TOKEN_BYTE_LENGTH = 32
export const SESSION_ISSUER = 'geek-infiltration'
export const OAUTH_TRANSACTION_AUDIENCE = 'geek-infiltration-oauth'
export const LOCAL_SERVER_PORT = 3005
export const HTTP_STATUS_NO_CONTENT = 204
export const HTTP_STATUS_FOUND = 302
export const HTTP_STATUS_BAD_REQUEST = 400
export const HTTP_STATUS_UNAUTHORIZED = 401
export const HTTP_STATUS_METHOD_NOT_ALLOWED = 405
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500
export const HTTP_STATUS_BAD_GATEWAY = 502
export const MILLISECONDS_PER_SECOND = 1_000
