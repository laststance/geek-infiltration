# Research & Design Decisions

---

## **Purpose**: Capture discovery findings, architectural investigations, and rationale that inform the technical design.

## Summary

- **Feature**: `github-following-suggestions-and-landing-page`
- **Discovery Scope**: Extension (modifying existing components + adding web assets)
- **Key Findings**:
  - GitHub GraphQL API supports `viewer.following` query with pagination
  - MUI v7 Autocomplete supports freeSolo mode with custom renderOption
  - OG image optimal size is 1200x630px with 1.91:1 aspect ratio

## Research Log

### GitHub GraphQL API - Viewer Following

- **Context**: Need to fetch authenticated user's following list for autocomplete suggestions
- **Sources Consulted**:
  - [GitHub GraphQL Queries Reference](https://docs.github.com/en/graphql/reference/queries)
  - [GitHub Blog - GraphQL API](https://github.blog/developer-skills/github/exploring-github-cli-how-to-interact-with-githubs-graphql-api-endpoint/)
- **Findings**:
  - `viewer` query returns the authenticated user (type `User!`)
  - `User.following` is a connection type with pagination support
  - Available fields: `login`, `name`, `avatarUrl`, `totalCount`
  - Pagination args: `first`, `after`, `last`, `before`
  - Maximum 100 items per request (GitHub API limitation)
- **Implications**:
  - Query structure: `viewer { following(first: 100) { nodes { login, name, avatarUrl } } }`
  - Caching via RTK Query will minimize API calls
  - No need for complex pagination UI (first 100 sufficient per requirements)

### MUI v7 Autocomplete Component

- **Context**: Replace TextField with Autocomplete for user suggestions
- **Sources Consulted**:
  - [MUI Autocomplete Documentation](https://mui.com/material-ui/react-autocomplete/)
  - MUI v7.2.0 llms.txt via MUI MCP
- **Findings**:
  - `freeSolo` prop allows arbitrary input beyond suggestions
  - `renderOption` prop enables custom rendering with Avatar
  - `getOptionLabel` extracts display text from option objects
  - `filterOptions` with `createFilterOptions` for custom filtering
  - `loading` and `loadingText` props for async state
- **Implications**:
  - Use `freeSolo={true}` to allow custom username input
  - Custom `renderOption` for Avatar + Name + @login layout
  - Filter by both `name` and `login` fields locally
  - Integrate with react-hook-form via Controller

### Open Graph Meta Tags

- **Context**: Add social sharing metadata for landing page
- **Sources Consulted**:
  - [Open Graph Protocol](https://ogp.me/)
  - [OG Image Best Practices 2025](https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide)
- **Findings**:
  - Standard OG image size: 1200x630px (1.91:1 aspect ratio)
  - File format: PNG or JPG, under 5MB
  - Required tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
  - Twitter-specific: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - Keep important content in center 80% (safe zone for cropping)
- **Implications**:
  - Create `/public/og-image.png` at 1200x630px
  - Add meta tags to `index.html` head section
  - Test with Facebook Sharing Debugger and Twitter Card Validator

### Existing Codebase Analysis

- **Context**: Understand current patterns before extending
- **Sources Consulted**: Local codebase analysis via Read tool
- **Findings**:
  - `SubscribeFormModal.tsx` uses react-hook-form with Controller
  - GraphQL queries in `src/gql/*.graphql`, generated via codegen
  - RTK Query hooks auto-generated in `src/generated/graphql.ts`
  - MUI v7 with sx prop styling (no styled-components except LandingPage)
  - Landing page uses Framer Motion animations (`MotionInView`, `varFade`)
- **Implications**:
  - Follow existing Controller pattern for Autocomplete integration
  - Add new GraphQL file to `src/gql/getViewerFollowing.graphql`
  - Run `pnpm codegen` after adding query
  - Maintain MUI sx prop consistency in new components

## Architecture Pattern Evaluation

| Option                       | Description                              | Strengths                                         | Risks / Limitations                        | Notes                                   |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------- | ------------------------------------------ | --------------------------------------- |
| RTK Query for Following List | Use existing RTK Query + GraphQL pattern | Consistent with codebase, auto-caching, type-safe | Limited to 100 items without pagination UI | Selected - aligns with project patterns |
| SWR/React Query              | Alternative data fetching                | Popular, good DX                                  | Adds new dependency, breaks consistency    | Rejected - would introduce new pattern  |
| Direct graphql-request       | Manual fetching                          | Simple, no abstraction                            | No caching, no generated hooks             | Rejected - loses type safety benefits   |

## Design Decisions

### Decision: RTK Query for Following List Data

- **Context**: Need to fetch and cache user's following list
- **Alternatives Considered**:
  1. RTK Query via codegen (existing pattern)
  2. Direct graphql-request call
  3. Add SWR or TanStack Query
- **Selected Approach**: RTK Query via codegen
- **Rationale**: Consistent with existing codebase patterns, automatic type generation, built-in caching
- **Trade-offs**: Tied to Redux store, but already using Redux
- **Follow-up**: Verify hook naming follows `useGetViewerFollowingQuery` convention

### Decision: Local Filtering for Autocomplete

- **Context**: Filter suggestions as user types
- **Alternatives Considered**:
  1. Local filtering with `filterOptions`
  2. Server-side filtering (re-fetch on each keystroke)
- **Selected Approach**: Local filtering
- **Rationale**: Following list is small (max 100), cached data, instant response
- **Trade-offs**: Loads all data upfront, but minimal impact for 100 items
- **Follow-up**: None

### Decision: Static OG Image Asset

- **Context**: Need OG image for social sharing
- **Alternatives Considered**:
  1. Static PNG asset in `/public`
  2. Dynamic OG image generation (Vercel OG, Satori)
- **Selected Approach**: Static PNG asset
- **Rationale**: Simple, no runtime cost, single page app with one URL
- **Trade-offs**: Manual update if branding changes
- **Follow-up**: Recommend using design tool (Figma/Canva) for consistent branding

## Risks & Mitigations

- **GitHub API Rate Limiting** — Mitigate with RTK Query caching, fetch once per session
- **Large Following List (>100)** — Mitigate by limiting to first 100 per requirements scope
- **OAuth Token Expiry** — Existing token refresh mechanism in authenticatorSlice handles this
- **OG Image Caching** — Add version query param if updates needed (e.g., `og-image.png?v=1`)

## References

- [GitHub GraphQL API Documentation](https://docs.github.com/en/graphql) — Official API reference
- [MUI Autocomplete v7](https://mui.com/material-ui/react-autocomplete/) — Component API
- [Open Graph Protocol](https://ogp.me/) — Meta tag specification
- [OG Image Sizes 2025 Guide](https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide) — Best practices
