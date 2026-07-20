# Geek Infiltration

🚧 It is a work in progress 🚧

## Local development

GitHub authentication uses a same-origin BFF. OAuth credentials and GitHub
access tokens stay in server-side Vite middleware locally and Vercel Functions
in production. The browser receives only a random session ID in an HttpOnly
cookie; production credentials are stored in Upstash Redis with a seven-day TTL.

1. Copy `.env.sample` to `.env`.
2. Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` from a GitHub OAuth App.
3. Generate `GEEK_INFILTRATION_SESSION_SECRET` with
   `openssl rand -base64 48`.
4. Set the OAuth App callback URL to
   `http://localhost:3005/api/auth/github/callback`.
5. Run `pnpm install` and `pnpm dev`.

Local Vite uses an in-process session store when Upstash variables are absent,
so no Redis setup is required for local login. Restarting Vite clears those
local sessions.

`GITHUB_REDIRECT_URI` may contain the application origin. The BFF always adds
`/api/auth/github/callback`, which keeps the authorize and token-exchange values
identical. Production must define `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
`GEEK_INFILTRATION_SESSION_SECRET`, the production `GITHUB_REDIRECT_URI`,
`UPSTASH_REDIS_REST_URL`, and
`UPSTASH_REDIS_REST_TOKEN` in Vercel rather than using `VITE_`-prefixed
variables. The Upstash Vercel integration can provision the two Redis values.

## Authentication API

- `GET /api/auth/github/start` creates OAuth state and PKCE values.
- `GET /api/auth/github/callback` exchanges the code and creates the session.
- `GET /api/auth/session` returns `{ "authenticated": boolean }` only.
- `POST /api/auth/logout` expires the session.
- `POST /api/github/graphql` proxies GitHub GraphQL with the server-owned token.

# License

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
