# Technology Stack

## Architecture

Single-page application (SPA) with client-side state management and GraphQL data fetching. No SSR - pure client-side React with Redux for state persistence.

## Core Technologies

- **Language**: TypeScript (strict mode enabled)
- **Framework**: React 19 (latest, with Concurrent features)
- **Build**: Vite 7.3 with SWC (fast compilation)
- **Runtime**: Node.js 22+ (Volta-managed)

## Key Libraries

| Library         | Purpose          | Pattern                 |
| --------------- | ---------------- | ----------------------- |
| MUI v7          | UI components    | Theme + sx prop styling |
| Redux Toolkit   | State management | Slices + RTK Query      |
| graphql-request | GraphQL client   | RTK Query integration   |
| Framer Motion   | Animations       | Motion components       |
| Sentry          | Error tracking   | Production-only         |

## Development Standards

### Type Safety

- TypeScript strict mode (`strict: true`)
- Path aliases: `@/*` → `./src/*`
- Generated types for GraphQL operations

### Code Quality

- ESLint: ts-prefixer + react-hooks rules
- Prettier: auto-formatting via lint-staged
- Husky: pre-commit hooks

### Testing

- **Unit**: Vitest with jsdom (globals enabled)
- **E2E**: Playwright (Chromium/Firefox/WebKit)
- **Coverage**: Parallel test execution

## Development Environment

### Required Tools

- Node.js 22+ (managed via Volta)
- pnpm (package manager)
- Git

### Common Commands

```bash
# Dev: pnpm dev (port 3005)
# Build: pnpm build
# Test: pnpm playwright:ui
# Validate: pnpm validate (lint + typecheck + build)
# Codegen: pnpm codegen (GraphQL types)
```

## Key Technical Decisions

| Decision            | Rationale                                                  |
| ------------------- | ---------------------------------------------------------- |
| RTK Query + GraphQL | Type-safe data fetching with caching, auto-generated hooks |
| Redux Persist       | Persist auth tokens and subscriptions across sessions      |
| MUI v7 Grid         | Modern CSS Grid layout, better performance than v5         |
| Vite + SWC          | Fastest development experience, instant HMR                |
| React 19            | Latest concurrent features, improved performance           |

---

_Document standards and patterns, not every dependency_
