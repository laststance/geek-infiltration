# Project Structure

## Organization Philosophy

Feature-first organization with shared components. Each feature is self-contained with its own components, assets, and logic. Cross-cutting concerns (hooks, redux, constants) are elevated to `src/` root.

## Directory Patterns

### Feature Modules (`/src/{FeatureName}/`)

**Location**: `src/LandingPage/`, `src/app/`
**Purpose**: Self-contained feature implementations
**Pattern**: PascalCase directory, contains components + assets + animations
**Example**: `src/LandingPage/` - marketing pages, `src/app/` - main application

### Shared Components (`/src/components/`)

**Location**: `src/components/`
**Purpose**: Reusable UI components used across features
**Pattern**: PascalCase files, export component + types
**Example**: `ErrorBoundary.tsx`, `CommentCard.tsx`, `Text.tsx`

### State Management (`/src/redux/`)

**Location**: `src/redux/`
**Purpose**: Redux slices for global state
**Pattern**: `{domain}Slice.ts` naming, RTK createSlice
**Example**: `authenticatorSlice.ts`, `subscribedSlice.ts`

### Custom Hooks (`/src/hooks/`)

**Location**: `src/hooks/`
**Purpose**: Reusable React hooks
**Pattern**: `use{Name}.ts` naming
**Example**: `useModalControl.tsx`, `useAppSelector.ts`

### GraphQL (`/src/gql/` + `/src/generated/`)

**Location**: Operations in `src/gql/`, generated in `src/generated/`
**Purpose**: GraphQL operations and auto-generated RTK Query hooks
**Pattern**: Define `.graphql` files → run codegen → use generated hooks

### Constants (`/src/constants/`)

**Location**: `src/constants/`
**Purpose**: App-wide configuration and constants
**Example**: `api.ts` (RTK Query base), `theme.ts`, `endpoint.ts`

## Naming Conventions

- **Directories**: PascalCase for features (`LandingPage`), camelCase for utilities (`hooks`)
- **Components**: PascalCase (`HomeMinimal.tsx`, `CommentCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useModalControl.ts`)
- **Slices**: camelCase with `Slice` suffix (`authenticatorSlice.ts`)
- **Constants**: camelCase (`api.ts`, `theme.ts`)

## Import Organization

```typescript
// 1. External libraries (React, MUI, etc.)
import { useState } from 'react'
import { Box, Typography } from '@mui/material'

// 2. Absolute imports (path alias)
import { useAppSelector } from '@/hooks/useAppSelector'
import { theme } from '@/constants/theme'

// 3. Relative imports (local)
import { LocalComponent } from './LocalComponent'
```

**Path Aliases**:

- `@/` → `./src/` (all source files)

## Code Organization Principles

- **Feature isolation**: Features don't import from each other
- **Shared extraction**: Common components go to `/src/components/`
- **Generated code**: Never edit `/src/generated/` - it's auto-generated
- **Entry point**: `main.tsx` → `Authenticator` → `App` or `LandingPage`
- **State boundaries**: Redux for global, React state for local UI

---

_Document patterns, not file trees. New files following patterns shouldn't require updates_
