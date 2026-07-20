import {
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_METHOD_NOT_ALLOWED,
} from '../../server/auth/constants.js'
import { readValidatedAuthSession } from '../../server/auth/utils/readValidatedAuthSession.js'

/**
 * Reports only whether the HttpOnly session is valid when React Router guards a public or private route.
 * @param request - Same-origin session status request carrying browser cookies.
 * @returns Non-cacheable authentication status without the GitHub credential.
 * @example
 * await authSessionFunction.fetch(new Request('https://app.test/api/auth/session'))
 */
async function readAuthSession(request: Request) {
  if (request.method !== 'GET') {
    // Route loaders only read session state and never mutate it.
    return Response.json(
      { error: 'method_not_allowed' },
      { status: HTTP_STATUS_METHOD_NOT_ALLOWED },
    )
  }

  try {
    const session = await readValidatedAuthSession(request)

    return Response.json(
      { authenticated: session !== null },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch {
    // Missing Redis configuration is distinct from a normal signed-out session.
    return Response.json(
      { error: 'session_server_not_configured' },
      { status: HTTP_STATUS_INTERNAL_SERVER_ERROR },
    )
  }
}

const authSessionFunction = {
  fetch: readAuthSession,
}

export default authSessionFunction
