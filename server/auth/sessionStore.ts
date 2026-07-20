import { Redis } from '@upstash/redis'
import { randomBytes } from 'node:crypto'

import {
  MILLISECONDS_PER_SECOND,
  RANDOM_TOKEN_BYTE_LENGTH,
  SESSION_MAX_AGE_SECONDS,
  SESSION_STORAGE_KEY_PREFIX,
} from './constants.js'

export type AuthSession = {
  githubAccessToken: string
}

type LocalAuthSession = AuthSession & {
  expiresAtMs: number
}

/**
 * Stores GitHub credentials in Redis when OAuth completes so the browser receives only a random session ID.
 * @returns Shared store used by OAuth callback, session validation, GraphQL proxy, and logout routes.
 * @example
 * authSessionStore.create('github-token')
 */
class AuthSessionStore {
  private readonly localSessions = new Map<string, LocalAuthSession>()

  /**
   * Selects a process-local store only for Vite development when Upstash credentials are intentionally absent.
   * @returns True for local development without Redis configuration; false for Vercel and production.
   * @example
   * authSessionStore uses Redis when UPSTASH_REDIS_REST_URL is defined
   */
  private shouldUseLocalMemory() {
    return (
      process.env.NODE_ENV === 'development' &&
      (!process.env.UPSTASH_REDIS_REST_URL ||
        !process.env.UPSTASH_REDIS_REST_TOKEN)
    )
  }

  /**
   * Creates a server-side credential record after GitHub OAuth succeeds.
   * @param githubAccessToken - GitHub credential that must remain server-side.
   * @returns Cryptographically random browser session ID with a matching expiring Redis record.
   * @example
   * await authSessionStore.create('github-token') // => 'random-session-id'
   */
  async create(githubAccessToken: string) {
    const sessionId = randomBytes(RANDOM_TOKEN_BYTE_LENGTH).toString(
      'base64url',
    )
    // Local Vite can authenticate without provisioning cloud infrastructure.
    if (this.shouldUseLocalMemory()) {
      this.localSessions.set(sessionId, {
        expiresAtMs:
          Date.now() + SESSION_MAX_AGE_SECONDS * MILLISECONDS_PER_SECOND,
        githubAccessToken,
      })
      return sessionId
    }

    const redis = Redis.fromEnv()
    await redis.set(
      `${SESSION_STORAGE_KEY_PREFIX}${sessionId}`,
      githubAccessToken,
      { ex: SESSION_MAX_AGE_SECONDS },
    )
    return sessionId
  }

  /**
   * Resolves a browser session ID only when an authenticated BFF route needs the GitHub credential.
   * @param sessionId - Opaque random ID read from the HttpOnly cookie.
   * @returns Server-side GitHub credential, or null after logout, expiry, or an unknown ID.
   * @example
   * await authSessionStore.read('random-session-id') // => { githubAccessToken: 'github-token' }
   */
  async read(sessionId: string): Promise<AuthSession | null> {
    // Local development mirrors Redis TTL semantics inside the Vite process.
    if (this.shouldUseLocalMemory()) {
      const localSession = this.localSessions.get(sessionId)
      // Missing and expired records are deleted and treated as signed-out sessions.
      if (!localSession || localSession.expiresAtMs <= Date.now()) {
        this.localSessions.delete(sessionId)
        return null
      }

      return { githubAccessToken: localSession.githubAccessToken }
    }

    const redis = Redis.fromEnv()
    const githubAccessToken = await redis.get<string>(
      `${SESSION_STORAGE_KEY_PREFIX}${sessionId}`,
    )

    // Redis can return null after TTL expiry, so expired IDs fail closed.
    if (typeof githubAccessToken !== 'string') return null

    return { githubAccessToken }
  }

  /**
   * Deletes the server-side credential record when the account menu logs the user out.
   * @param sessionId - Opaque random ID read before its cookie is expired.
   * @returns Resolves after Redis invalidates the session.
   * @example
   * await authSessionStore.delete('random-session-id')
   */
  async delete(sessionId: string) {
    // Local development invalidates the in-process record just like Redis DEL.
    if (this.shouldUseLocalMemory()) {
      this.localSessions.delete(sessionId)
      return
    }

    const redis = Redis.fromEnv()
    await redis.del(`${SESSION_STORAGE_KEY_PREFIX}${sessionId}`)
  }
}

export const authSessionStore = new AuthSessionStore()
