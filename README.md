# Geek Infiltration

GitHub activity timeline and release feed for the developers you follow and the
repositories you star.

🚧 This project is a work in progress. The current Production deployment is
available at [geek-infiltration.vercel.app](https://geek-infiltration.vercel.app).

## Architecture

- The frontend remains a Vite + React single-page application.
- Same-origin Vercel Functions act as a small backend-for-frontend (BFF) for
  GitHub OAuth and GraphQL requests.
- GitHub OAuth credentials stay in Vercel environment variables. GitHub access
  tokens stay in seven-day server-side sessions backed by Upstash Redis.
- The browser receives only an opaque session ID in a `Secure`, `HttpOnly`,
  `SameSite=Lax` cookie. No GitHub token is returned to or bundled into the SPA.
- During local development, Vite mounts the same Function handlers as
  middleware. The `server/` directory is shared server code, not a separately
  started service.

## Local development

The local Volta toolchain uses Node.js `22.21.1` and pnpm `11.9.0` (see
`package.json`). The Vercel project currently runs Production Functions on
Node.js `24.x`, so use the Vercel build check below as well as the local checks.

### Setup

Install dependencies, link the existing Vercel project once, and pull its
Development environment variables. The commands use pinned CLI versions so
they also work on a clean machine:

```sh
pnpm install
pnpm dlx vercel@56.3.2 link --yes --team laststance --project geek-infiltration
pnpm dlx vercel@56.3.2 env pull .env.local --environment development --yes --scope laststance
```

The shared Development OAuth App is configured as follows:

- Application name: `Geek Infiltration Local`
- Homepage URL: `http://localhost:3005`
- Authorization callback URL:
  `http://localhost:3005/api/auth/github/callback`

If you cannot access the Vercel project, copy `.env.sample` to `.env.local` and
configure your own GitHub OAuth App. The following server-only values are used:

| Variable                           | Purpose                                                |
| ---------------------------------- | ------------------------------------------------------ |
| `GITHUB_CLIENT_ID`                 | GitHub OAuth App client ID                             |
| `GITHUB_CLIENT_SECRET`             | GitHub OAuth App client secret                         |
| `GEEK_INFILTRATION_SESSION_SECRET` | At least 32 characters; encrypts transient OAuth state |
| `GITHUB_REDIRECT_URI`              | Application origin, normally `http://localhost:3005`   |
| `UPSTASH_REDIS_REST_URL`           | Optional locally; required in Production               |
| `UPSTASH_REDIS_REST_TOKEN`         | Optional locally; required in Production               |

Generate a dedicated session secret with `openssl rand -base64 48`. Never
prefix OAuth credentials, the session secret, or Redis credentials with
`VITE_`; Vite exposes those variables to browser code.

### Start

Release the project port before starting the canonical local server:

```sh
pnpm dlx kill-port@2.0.1 3005
pnpm dev
```

The machine-local `kill-port 3005` command is equivalent when it is installed.

Open [http://localhost:3005](http://localhost:3005). There is no separate
command for `server/`; `pnpm dev` starts both the SPA and its local BFF adapter.

When Upstash variables are absent, Vite uses an in-process session store so
local login still works. Restarting Vite clears those local sessions.

`GITHUB_REDIRECT_URI` may contain the application origin. The BFF always adds
`/api/auth/github/callback`, which keeps the authorize and token-exchange values
identical.

## Production deployment

Vercel automatically creates a Production deployment when `main` is pushed.
Production uses a separate GitHub OAuth App whose callback URL is
`https://geek-infiltration.vercel.app/api/auth/github/callback`.

Define all six server-only variables from the table above in the Vercel
Production environment, using `https://geek-infiltration.vercel.app` for
`GITHUB_REDIRECT_URI`. The Upstash integration can provision the Redis URL and
token.

Inspect the latest Production deployment and its public session endpoint with:

```sh
pnpm dlx vercel@56.3.2 list --environment production --scope laststance
curl -sS https://geek-infiltration.vercel.app/api/auth/session
```

The signed-out health response is `{ "authenticated": false }`.

## Verification

```sh
pnpm validate
pnpm exec vitest run
pnpm playwright
pnpm dlx vercel@56.3.2 build --prod --scope laststance
```

`pnpm validate` runs ESLint fixes, TypeScript checking, and the Vite build.
Review the working tree afterward because lint fixes may update files.
After a Production deploy, complete a real GitHub login and confirm both
`/app` and `/releases`; builds and mocked tests do not prove the OAuth App
configuration.

## Authentication API

- `GET /api/auth/github/start` creates OAuth state and PKCE values.
- `GET /api/auth/github/callback` exchanges the code and creates the session.
- `GET /api/auth/session` returns `{ "authenticated": boolean }` only.
- `POST /api/auth/logout` expires the session.
- `POST /api/github/graphql` proxies GitHub GraphQL with the server-owned token.

## License

MIT

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://ryota-murakami.github.io/"><img src="https://avatars1.githubusercontent.com/u/5501268?s=400&u=7bf6b1580b95930980af2588ef0057f3e9ec1ff8&v=4?s=100" width="100px;" alt=""/><br /><sub><b>ryota-murakami</b></sub></a><br /><a href="https://github.com/laststance/vite-react-ts-extended/laststance/vite-react-ts-extended/commits?author=ryota-murakami" title="Code">💻</a> <a href="https://github.com/laststance/vite-react-ts-extended/laststance/vite-react-ts-extended/commits?author=ryota-murakami" title="Documentation">📖</a> <a href="https://github.com/laststance/vite-react-ts-extended/laststance/vite-react-ts-extended/commits?author=ryota-murakami" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
