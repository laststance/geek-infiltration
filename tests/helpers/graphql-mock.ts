import { Page, Route } from '@playwright/test'

/**
 * GraphQL operation types
 */
export type GraphQLOperation = {
  operationName?: string
  query: string
  variables?: Record<string, unknown>
}

/**
 * GraphQL mock response handler
 */
export type GraphQLMockHandler = (
  operation: GraphQLOperation,
) => Record<string, unknown> | Promise<Record<string, unknown>>

/**
 * Mock GraphQL API responses
 */
export class GraphQLMocker {
  private handlers: Map<string, GraphQLMockHandler> = new Map()

  /**
   * Add a mock handler for a specific operation
   */
  mockOperation(operationName: string, handler: GraphQLMockHandler) {
    this.handlers.set(operationName, handler)
    return this
  }

  /**
   * Setup route interception for GraphQL API
   */
  async setup(page: Page, apiUrl = 'https://api.github.com/graphql') {
    await page.route(apiUrl, async (route: Route) => {
      const request = route.request()
      const postData = request.postData()

      if (!postData) {
        route.continue()
        return
      }

      try {
        const operation: GraphQLOperation = JSON.parse(postData)
        const operationName = operation.operationName

        if (operationName && this.handlers.has(operationName)) {
          const handler = this.handlers.get(operationName)!
          const response = await handler(operation)

          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: response }),
          })
        } else {
          // No mock handler, let it through (or fail in test mode)
          route.continue()
        }
      } catch (error) {
        console.error('GraphQL mock error:', error)
        route.continue()
      }
    })
  }

  /**
   * Clear all mock handlers
   */
  clear() {
    this.handlers.clear()
  }
}

/**
 * Common mock data generators
 */
export const mockData = {
  /**
   * Generate mock user data
   */
  user: (overrides = {}) => ({
    id: 'user-123',
    login: 'testuser',
    name: 'Test User',
    avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
    bio: 'Test user bio',
    company: 'Test Company',
    location: 'Test Location',
    email: 'test@example.com',
    createdAt: '2020-01-01T00:00:00Z',
    followers: {
      totalCount: 100,
    },
    following: {
      totalCount: 50,
    },
    ...overrides,
  }),

  /**
   * Generate mock repository data
   */
  repository: (overrides = {}) => ({
    id: 'repo-456',
    name: 'test-repo',
    owner: {
      login: 'testuser',
    },
    description: 'Test repository description',
    stargazerCount: 42,
    forkCount: 10,
    url: 'https://github.com/testuser/test-repo',
    primaryLanguage: {
      name: 'TypeScript',
      color: '#2b7489',
    },
    createdAt: '2021-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  /**
   * Generate mock issue data
   */
  issue: (overrides = {}) => ({
    id: 'issue-789',
    number: 1,
    title: 'Test Issue',
    body: 'This is a test issue body',
    state: 'OPEN',
    author: {
      login: 'testuser',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    comments: {
      totalCount: 5,
      nodes: [],
    },
    labels: {
      nodes: [
        {
          name: 'bug',
          color: 'd73a4a',
        },
      ],
    },
    ...overrides,
  }),

  /**
   * Generate mock comment data
   */
  comment: (overrides = {}) => ({
    id: 'comment-101',
    body: 'This is a test comment',
    author: {
      login: 'testuser',
      avatarUrl: 'https://avatars.githubusercontent.com/u/123?v=4',
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  }),

  /**
   * Generate paginated response
   */
  paginated: (nodes: unknown[], pageInfo = {}) => ({
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'cursor-start',
      endCursor: 'cursor-end',
      ...pageInfo,
    },
    nodes,
    totalCount: nodes.length,
  }),
}

/**
 * Create a GraphQL error response
 */
export function mockGraphQLError(
  message: string,
  extensions: Record<string, unknown> = {},
) {
  return {
    errors: [
      {
        message,
        extensions: {
          code: 'INTERNAL_SERVER_ERROR',
          ...extensions,
        },
      },
    ],
  }
}

/**
 * Common operation mocks
 */
export const commonMocks = {
  /**
   * Mock viewer (current user) query
   */
  viewer: () => ({
    viewer: mockData.user({
      login: 'e2e-test-user',
      name: 'E2E Test User',
    }),
  }),

  /**
   * Mock empty timeline
   */
  emptyTimeline: () => ({
    viewer: {
      repositories: mockData.paginated([]),
    },
  }),

  /**
   * Mock timeline with repositories
   */
  timelineWithRepos: (count = 5) => ({
    viewer: {
      repositories: mockData.paginated(
        Array.from({ length: count }, (_, i) =>
          mockData.repository({
            id: `repo-${i}`,
            name: `test-repo-${i}`,
          }),
        ),
      ),
    },
  }),
}
