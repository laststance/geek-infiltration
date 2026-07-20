# Project Guidance

## GitHub Accounts for Development and QA

Use the following public GitHub accounts for development and QA fixtures:

eps1lon
EskiMojo14
markerikson
phryneas
dsherret
sindresorhus
bartlomieju
IanVS
kettanaito
t3dotgg
bluebill1049
gaearon
bvaughn
andrii_sherman
kentcdodds
sebmarkbage
acdlite
JoshuaKGoldberg
Jarred-Sumner
shadcn
saadeghi
antfu

## Architecture

- Vite + React SPA with a same-origin Vercel Functions BFF.
- `vite.config.ts` mounts the Function handlers as local Vite middleware.
- `server/` contains shared server modules; it is not an independently started
  application.
- GitHub access tokens live only in server-side sessions. Upstash Redis backs
  deployed sessions with a seven-day TTL; local development can fall back to
  process memory.

## Authentication Boundaries

- Never add `GITHUB_CLIENT_SECRET`, GitHub access tokens,
  `GEEK_INFILTRATION_SESSION_SECRET`, or Upstash credentials to a `VITE_`
  variable, Redux state, browser storage, or a client response.
- The browser may receive only the opaque `Secure`, `HttpOnly`, `SameSite=Lax`
  session cookie and `{ "authenticated": boolean }` session status.
- Preserve OAuth state validation, PKCE, same-origin return paths, generic
  public errors, and server-side GraphQL proxying when changing authentication.
- BFF routes are `/api/auth/github/start`, `/api/auth/github/callback`,
  `/api/auth/session`, `/api/auth/logout`, and `/api/github/graphql`.

## Local Development

- Canonical server command: `kill-port 3005 && pnpm dev`; on a clean machine,
  use `pnpm dlx kill-port@2.0.1 3005` before `pnpm dev`.
- Local URL: `http://localhost:3005`.
- Shared OAuth App: `Geek Infiltration Local`.
- OAuth callback: `http://localhost:3005/api/auth/github/callback`.
- Pull the configured Development environment with
  `pnpm dlx vercel@56.3.2 env pull .env.local --environment development --yes --scope laststance`.
- Required server variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
  `GEEK_INFILTRATION_SESSION_SECRET`, and `GITHUB_REDIRECT_URI`.
- `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are optional locally;
  without them, restarting Vite clears authenticated sessions.

## Deploy Configuration

- Platform: Vercel (`laststance/geek-infiltration`)
- Production URL: `https://geek-infiltration.vercel.app`
- Local Volta runtime: Node.js `22.21.1`; Production Functions runtime: Node.js
  `24.x`.
- Run Vercel commands as `pnpm dlx vercel@56.3.2 ...` so clean machines use the
  verified CLI version without a global dependency.
- Project type: Vite SPA with same-origin Vercel Functions BFF
- Deploy workflow: push `main` for an automatic Production deployment
- Production OAuth callback:
  `https://geek-infiltration.vercel.app/api/auth/github/callback`
- Production environment requires `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
  `GEEK_INFILTRATION_SESSION_SECRET`, `GITHUB_REDIRECT_URI`,
  `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.
- Inspect deployments with
  `pnpm dlx vercel@56.3.2 list --environment production --scope laststance`.
- Health check:
  `curl -sS https://geek-infiltration.vercel.app/api/auth/session`.

## Verification

- Project validation: `pnpm validate` (may apply ESLint fixes; inspect the diff).
- Tests: `pnpm exec vitest run`.
- Browser suite: `pnpm playwright`.
- Vercel Function build:
  `pnpm dlx vercel@56.3.2 build --prod --scope laststance`.
- Before calling authentication complete, verify the real GitHub OAuth flow in
  the target environment; unit tests and a successful build are insufficient.

## Vercel Functions Compatibility

- Keep explicit `.js` extensions on relative imports used by `api/**/*.ts` and
  their server-side dependency graph; deployed Functions execute emitted Node
  ESM.
- Keep TypeScript on the current major version declared in `package.json`
  unless a local `pnpm dlx vercel@56.3.2 build --prod` proves the Functions
  builder supports the upgrade.
