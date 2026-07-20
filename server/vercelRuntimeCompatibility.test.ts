import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const VERCEL_RUNTIME_MODULE_PATHS = [
  'api/auth/github/callback.ts',
  'api/auth/github/start.ts',
  'api/auth/logout.ts',
  'api/auth/session.ts',
  'api/github/graphql.ts',
  'server/auth/environment.ts',
  'server/auth/session.ts',
  'server/auth/sessionStore.ts',
  'server/auth/utils/readValidatedAuthSession.ts',
]

describe('Vercel Node ESM runtime compatibility', () => {
  it('keeps every deployed BFF relative import resolvable after TypeScript emits JavaScript', async () => {
    // Arrange
    const projectRootPath = process.cwd()

    // Act
    const runtimeModuleSources = await Promise.all(
      VERCEL_RUNTIME_MODULE_PATHS.map((modulePath) =>
        readFile(resolve(projectRootPath, modulePath), 'utf8'),
      ),
    )
    const extensionlessRelativeImports = runtimeModuleSources.flatMap(
      (moduleSource) =>
        Array.from(
          moduleSource.matchAll(/from\s+['"](\.{1,2}\/[^'"]+)['"]/g),
          (match) => match[1],
        ).filter((moduleSpecifier) => !moduleSpecifier.endsWith('.js')),
    )

    // Assert
    expect(extensionlessRelativeImports).toEqual([])
  })
})
