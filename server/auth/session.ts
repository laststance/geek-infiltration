import { EncryptJWT, jwtDecrypt } from 'jose'

import {
  OAUTH_TRANSACTION_AUDIENCE,
  OAUTH_TRANSACTION_MAX_AGE_SECONDS,
  SESSION_ISSUER,
} from './constants'

export type OAuthTransaction = {
  codeVerifier: string
  returnTo: string
  state: string
}

/**
 * Derives the fixed-size JWE key used only by server routes to seal browser-held session envelopes.
 * @param sessionSecret - High-entropy Vercel environment secret.
 * @returns A 256-bit symmetric encryption key.
 * @example
 * await deriveEncryptionKey('a-secret-containing-at-least-32-characters')
 */
async function deriveEncryptionKey(sessionSecret: string) {
  const secretBytes = new TextEncoder().encode(sessionSecret)
  const digest = await crypto.subtle.digest('SHA-256', secretBytes)
  return new Uint8Array(digest)
}

/**
 * Encrypts transient state and PKCE material when the OAuth start route redirects to GitHub.
 * @param transaction - OAuth state, verifier, and safe post-login route.
 * @param sessionSecret - Server-only secret used to derive the JWE key.
 * @returns Compact encrypted JWE stored in an HttpOnly transaction cookie.
 * @example
 * await sealOAuthTransaction({ codeVerifier: 'verifier', returnTo: '/app', state: 'state' }, secret)
 */
export async function sealOAuthTransaction(
  transaction: OAuthTransaction,
  sessionSecret: string,
) {
  const encryptionKey = await deriveEncryptionKey(sessionSecret)

  return new EncryptJWT({
    codeVerifier: transaction.codeVerifier,
    returnTo: transaction.returnTo,
    state: transaction.state,
  })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setIssuer(SESSION_ISSUER)
    .setAudience(OAUTH_TRANSACTION_AUDIENCE)
    .setExpirationTime(`${OAUTH_TRANSACTION_MAX_AGE_SECONDS}s`)
    .encrypt(encryptionKey)
}

/**
 * Opens the OAuth transaction only during the callback and rejects tampered, expired, or wrongly scoped cookies.
 * @param encryptedTransaction - Compact JWE read from the HttpOnly transaction cookie.
 * @param sessionSecret - Server-only secret used to derive the JWE key.
 * @returns Verified transaction, or null when validation fails.
 * @example
 * await unsealOAuthTransaction(encryptedCookie, secret) // => { codeVerifier, returnTo, state }
 */
export async function unsealOAuthTransaction(
  encryptedTransaction: string,
  sessionSecret: string,
): Promise<OAuthTransaction | null> {
  try {
    const encryptionKey = await deriveEncryptionKey(sessionSecret)
    const { payload } = await jwtDecrypt(encryptedTransaction, encryptionKey, {
      audience: OAUTH_TRANSACTION_AUDIENCE,
      issuer: SESSION_ISSUER,
    })

    if (
      typeof payload.codeVerifier !== 'string' ||
      typeof payload.returnTo !== 'string' ||
      typeof payload.state !== 'string'
    ) {
      // A decrypted envelope without every expected string is not a valid OAuth transaction.
      return null
    }

    return {
      codeVerifier: payload.codeVerifier,
      returnTo: payload.returnTo,
      state: payload.state,
    }
  } catch {
    // Tampered, expired, or wrongly scoped transactions fail without exposing crypto details.
    return null
  }
}
