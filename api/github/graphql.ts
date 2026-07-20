import {
  GITHUB_GRAPHQL_API_URL,
  GITHUB_REQUEST_TIMEOUT_MS,
  HTTP_STATUS_BAD_GATEWAY,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
  HTTP_STATUS_UNAUTHORIZED,
} from '../../server/auth/constants.js'
import { readValidatedAuthSession } from '../../server/auth/utils/readValidatedAuthSession.js'

/**
 * Proxies authenticated GraphQL calls so only the BFF can read or send the user's GitHub token.
 * @param request - Same-origin GraphQL POST carrying an HttpOnly application session.
 * @returns Sanitized GitHub GraphQL response, or an authentication/gateway error.
 * @example
 * await githubGraphqlFunction.fetch(new Request('https://app.test/api/github/graphql', { method: 'POST' }))
 */
async function proxyGitHubGraphql(request: Request) {
  if (request.method !== 'POST') {
    // GitHub GraphQL accepts request documents only through POST in this BFF.
    return Response.json(
      { error: 'method_not_allowed' },
      { status: HTTP_STATUS_METHOD_NOT_ALLOWED },
    )
  }

  try {
    const session = await readValidatedAuthSession(request)
    // Anonymous requests stop before any network call to GitHub.
    if (!session) {
      return Response.json(
        { error: 'authentication_required' },
        {
          headers: { 'Cache-Control': 'no-store' },
          status: HTTP_STATUS_UNAUTHORIZED,
        },
      )
    }

    const graphqlBody = await request.text()
    // Empty documents are client errors and should not consume GitHub API capacity.
    if (!graphqlBody) {
      return Response.json(
        { error: 'graphql_body_required' },
        {
          headers: { 'Cache-Control': 'no-store' },
          status: HTTP_STATUS_BAD_REQUEST,
        },
      )
    }

    const githubResponse = await fetch(GITHUB_GRAPHQL_API_URL, {
      body: graphqlBody,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${session.githubAccessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Geek-Infiltration',
      },
      method: 'POST',
      signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS),
    })
    const responseBody = await githubResponse.text()

    return new Response(responseBody, {
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type':
          githubResponse.headers.get('content-type') || 'application/json',
      },
      status: githubResponse.status,
    })
  } catch {
    // Hide upstream and Redis details behind a stable gateway failure contract.
    return Response.json(
      { error: 'github_graphql_unavailable' },
      {
        headers: { 'Cache-Control': 'no-store' },
        status: HTTP_STATUS_BAD_GATEWAY,
      },
    )
  }
}

const githubGraphqlFunction = {
  fetch: proxyGitHubGraphql,
}

export default githubGraphqlFunction
