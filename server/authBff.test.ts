// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const redisMock = vi.hoisted(() => {
  const values = new Map<string, string>()

  return {
    delete: vi.fn(async (key: string) => Number(values.delete(key))),
    get: vi.fn(async (key: string) => values.get(key) ?? null),
    set: vi.fn(async (key: string, value: string, _options: { ex: number }) => {
      values.set(key, value)
      return 'OK'
    }),
    values,
  }
})

vi.mock('@upstash/redis', () => ({
  Redis: {
    fromEnv: () => ({
      del: redisMock.delete,
      get: redisMock.get,
      set: redisMock.set,
    }),
  },
}))

import githubOAuthCallbackFunction from '../api/auth/github/callback'
import githubOAuthStartFunction from '../api/auth/github/start'
import authLogoutFunction from '../api/auth/logout'
import authSessionFunction from '../api/auth/session'
import githubGraphqlFunction from '../api/github/graphql'

const TEST_SESSION_SECRET = 'test-session-secret-with-at-least-32-characters'

describe('GitHub authentication BFF', () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = 'github-client-id'
    process.env.GITHUB_CLIENT_SECRET = 'github-client-secret'
    process.env.GEEK_INFILTRATION_SESSION_SECRET = TEST_SESSION_SECRET
    redisMock.values.clear()
    redisMock.delete.mockClear()
    redisMock.get.mockClear()
    redisMock.set.mockClear()
  })

  afterEach(() => {
    delete process.env.GITHUB_CLIENT_ID
    delete process.env.GITHUB_CLIENT_SECRET
    delete process.env.GITHUB_REDIRECT_URI
    delete process.env.GEEK_INFILTRATION_SESSION_SECRET
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('starts login with server-generated OAuth state and PKCE', async () => {
    // Arrange
    const request = new Request('https://app.example.com/api/auth/github/start')

    // Act
    const response = await githubOAuthStartFunction.fetch(request)

    // Assert
    expect(response.status).toBe(302)
    const location = response.headers.get('location')
    expect(location).not.toBeNull()
    const authorizationUrl = new URL(location ?? '')
    expect(authorizationUrl.origin).toBe('https://github.com')
    expect(authorizationUrl.pathname).toBe('/login/oauth/authorize')
    expect(authorizationUrl.searchParams.get('client_id')).toBe(
      'github-client-id',
    )
    expect(authorizationUrl.searchParams.get('redirect_uri')).toBe(
      'https://app.example.com/api/auth/github/callback',
    )
    expect(authorizationUrl.searchParams.get('scope')).toBe('user')
    expect(authorizationUrl.searchParams.get('state')).toHaveLength(43)
    expect(authorizationUrl.searchParams.get('code_challenge')).toHaveLength(43)
    expect(authorizationUrl.searchParams.get('code_challenge_method')).toBe(
      'S256',
    )
    expect(response.headers.get('set-cookie')).toMatch(
      /^__Host-geek-infiltration-oauth=.+; Max-Age=600; Path=\/; HttpOnly; Secure; SameSite=Lax$/,
    )
  })

  it('completes login with an opaque session cookie instead of exposing the GitHub token', async () => {
    // Arrange
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request('https://app.example.com/api/auth/github/start'),
    )
    const authorizationUrl = new URL(
      startResponse.headers.get('location') ?? '',
    )
    const returnedState = authorizationUrl.searchParams.get('state')
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    const githubFetch = vi.fn(async (_input: string | URL | Request) =>
      Response.json({ access_token: 'server-only-github-token' }),
    )
    vi.stubGlobal('fetch', githubFetch)
    const callbackRequest = new Request(
      `https://app.example.com/api/auth/github/callback?code=github-code&state=${returnedState}`,
      {
        headers: { Cookie: transactionCookie ?? '' },
      },
    )

    // Act
    const response = await githubOAuthCallbackFunction.fetch(callbackRequest)

    // Assert
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://app.example.com/app')
    const setCookieHeader = response.headers.get('set-cookie') ?? ''
    expect(setCookieHeader).toMatch(
      /__Host-geek-infiltration-session=[A-Za-z0-9_-]{43};/,
    )
    expect(setCookieHeader).toContain('Max-Age=604800')
    expect(setCookieHeader).toContain('HttpOnly')
    expect(setCookieHeader).not.toContain('server-only-github-token')
    expect([...redisMock.values.values()]).toEqual(['server-only-github-token'])
    expect(setCookieHeader).toContain(
      '__Host-geek-infiltration-oauth=; Max-Age=0',
    )
    expect(await response.text()).not.toContain('server-only-github-token')
    expect(githubFetch).toHaveBeenCalledOnce()
    const tokenRequest = githubFetch.mock.calls[0]?.[1]
    expect(tokenRequest?.method).toBe('POST')
    expect(tokenRequest?.body).toBeInstanceOf(URLSearchParams)
    const tokenRequestBody = tokenRequest?.body
    if (!(tokenRequestBody instanceof URLSearchParams)) {
      throw new Error('GitHub token request body should be URLSearchParams')
    }
    expect(tokenRequestBody.get('client_secret')).toBe('github-client-secret')
    expect(tokenRequestBody.get('code')).toBe('github-code')
    expect(tokenRequestBody.get('code_verifier')).toHaveLength(43)
  })

  it('reports an authenticated session without returning the GitHub token', async () => {
    // Arrange
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request('https://app.example.com/api/auth/github/start'),
    )
    const authorizationUrl = new URL(
      startResponse.headers.get('location') ?? '',
    )
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ access_token: 'server-only-github-token' }),
      ),
    )
    const callbackResponse = await githubOAuthCallbackFunction.fetch(
      new Request(
        `https://app.example.com/api/auth/github/callback?code=github-code&state=${authorizationUrl.searchParams.get('state')}`,
        { headers: { Cookie: transactionCookie ?? '' } },
      ),
    )
    const sessionCookie = callbackResponse.headers
      .get('set-cookie')
      ?.match(/__Host-geek-infiltration-session=[^;,]+/)?.[0]

    // Act
    const response = await authSessionFunction.fetch(
      new Request('https://app.example.com/api/auth/session', {
        headers: { Cookie: sessionCookie ?? '' },
      }),
    )

    // Assert
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ authenticated: true })
  })

  it('reports signed out when no protected session cookie exists', async () => {
    // Arrange
    const request = new Request('https://app.example.com/api/auth/session')

    // Act
    const response = await authSessionFunction.fetch(request)

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ authenticated: false })
  })

  it('logs out by expiring the protected session cookie', async () => {
    // Arrange
    redisMock.values.set(
      'geek-infiltration:session:test-session-id',
      'server-only-github-token',
    )
    const request = new Request('https://app.example.com/api/auth/logout', {
      headers: {
        Cookie: '__Host-geek-infiltration-session=test-session-id',
      },
      method: 'POST',
    })

    // Act
    const response = await authLogoutFunction.fetch(request)

    // Assert
    expect(response.status).toBe(204)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(response.headers.get('set-cookie')).toBe(
      '__Host-geek-infiltration-session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax',
    )
    expect(redisMock.delete).toHaveBeenCalledWith(
      'geek-infiltration:session:test-session-id',
    )
    expect(redisMock.values.size).toBe(0)
  })

  it('proxies GraphQL with the server-owned GitHub token', async () => {
    // Arrange
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request('https://app.example.com/api/auth/github/start'),
    )
    const authorizationUrl = new URL(
      startResponse.headers.get('location') ?? '',
    )
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    const upstreamFetch = vi.fn(
      async (input: string | URL | Request, requestInit?: RequestInit) => {
        if (input.toString().includes('/login/oauth/access_token')) {
          return Response.json({ access_token: 'server-only-github-token' })
        }

        return Response.json({ data: { viewer: { login: 'octocat' } } })
      },
    )
    vi.stubGlobal('fetch', upstreamFetch)
    const callbackResponse = await githubOAuthCallbackFunction.fetch(
      new Request(
        `https://app.example.com/api/auth/github/callback?code=github-code&state=${authorizationUrl.searchParams.get('state')}`,
        { headers: { Cookie: transactionCookie ?? '' } },
      ),
    )
    const sessionCookie = callbackResponse.headers
      .get('set-cookie')
      ?.match(/__Host-geek-infiltration-session=[^;,]+/)?.[0]
    const graphqlBody = JSON.stringify({
      operationName: 'ViewerLogin',
      query: 'query ViewerLogin { viewer { login } }',
    })
    const request = new Request('https://app.example.com/api/github/graphql', {
      body: graphqlBody,
      headers: {
        'Content-Type': 'application/json',
        Cookie: sessionCookie ?? '',
      },
      method: 'POST',
    })

    // Act
    const response = await githubGraphqlFunction.fetch(request)

    // Assert
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      data: { viewer: { login: 'octocat' } },
    })
    expect(upstreamFetch).toHaveBeenCalledTimes(2)
    const graphqlRequest = upstreamFetch.mock.calls[1]
    expect(graphqlRequest?.[0]).toBe('https://api.github.com/graphql')
    const forwardedHeaders = new Headers(graphqlRequest?.[1]?.headers)
    expect(forwardedHeaders.get('authorization')).toBe(
      'Bearer server-only-github-token',
    )
    expect(forwardedHeaders.get('cookie')).toBeNull()
    expect(graphqlRequest?.[1]?.body).toBe(graphqlBody)
  })

  it('rejects GraphQL before contacting GitHub when the session is missing', async () => {
    // Arrange
    const githubFetch = vi.fn()
    vi.stubGlobal('fetch', githubFetch)
    const request = new Request('https://app.example.com/api/github/graphql', {
      body: JSON.stringify({ query: 'query { viewer { login } }' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })

    // Act
    const response = await githubGraphqlFunction.fetch(request)

    // Assert
    expect(response.status).toBe(401)
    expect(await response.json()).toEqual({
      error: 'authentication_required',
    })
    expect(githubFetch).not.toHaveBeenCalled()
  })

  it('rejects a mismatched OAuth state before exchanging a GitHub code', async () => {
    // Arrange
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request('https://app.example.com/api/auth/github/start'),
    )
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    const githubFetch = vi.fn()
    vi.stubGlobal('fetch', githubFetch)
    const callbackRequest = new Request(
      'https://app.example.com/api/auth/github/callback?code=github-code&state=wrong-state',
      { headers: { Cookie: transactionCookie ?? '' } },
    )

    // Act
    const response = await githubOAuthCallbackFunction.fetch(callbackRequest)

    // Assert
    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe(
      'https://app.example.com/?auth_error=github_oauth_failed',
    )
    expect(githubFetch).not.toHaveBeenCalled()
  })

  it('keeps post-login redirects on the application origin', async () => {
    // Arrange
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request(
        'https://app.example.com/api/auth/github/start?returnTo=%2F%5Cevil.example',
      ),
    )
    const authorizationUrl = new URL(
      startResponse.headers.get('location') ?? '',
    )
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ access_token: 'server-only-github-token' }),
      ),
    )

    // Act
    const callbackResponse = await githubOAuthCallbackFunction.fetch(
      new Request(
        `https://app.example.com/api/auth/github/callback?code=github-code&state=${authorizationUrl.searchParams.get('state')}`,
        { headers: { Cookie: transactionCookie ?? '' } },
      ),
    )

    // Assert
    expect(callbackResponse.headers.get('location')).toBe(
      'https://app.example.com/app',
    )
  })

  it('keeps local Vite sessions server-side without requiring Redis credentials', async () => {
    // Arrange
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('UPSTASH_REDIS_REST_URL', '')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', '')
    const startResponse = await githubOAuthStartFunction.fetch(
      new Request('http://localhost:3005/api/auth/github/start'),
    )
    const authorizationUrl = new URL(
      startResponse.headers.get('location') ?? '',
    )
    const transactionCookie = startResponse.headers
      .get('set-cookie')
      ?.split(';')[0]
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({ access_token: 'local-server-only-github-token' }),
      ),
    )

    // Act
    const callbackResponse = await githubOAuthCallbackFunction.fetch(
      new Request(
        `http://localhost:3005/api/auth/github/callback?code=github-code&state=${authorizationUrl.searchParams.get('state')}`,
        { headers: { Cookie: transactionCookie ?? '' } },
      ),
    )
    const sessionCookie = callbackResponse.headers
      .get('set-cookie')
      ?.match(/__Host-geek-infiltration-session=[^;,]+/)?.[0]
    const sessionResponse = await authSessionFunction.fetch(
      new Request('http://localhost:3005/api/auth/session', {
        headers: { Cookie: sessionCookie ?? '' },
      }),
    )

    // Assert
    expect(await sessionResponse.json()).toEqual({ authenticated: true })
    expect(redisMock.set).not.toHaveBeenCalled()
    expect(redisMock.get).not.toHaveBeenCalled()
  })
})
