# Implementation Plan

## Task Overview

| Major Task | Description                                            | Requirements | Parallel |
| ---------- | ------------------------------------------------------ | ------------ | -------- |
| 1          | Routing - React Router v7 and OAuth callback           | 1            | No       |
| 2          | Navigation - Sidebar route switching                   | 2, 7         | No       |
| 3          | Data Layer - Starred repository releases query         | 3, 4, 5, 6   | No       |
| 4          | Release Feed - Timeline view and cards                 | 3, 5, 7      | No       |
| 5          | Feed States - Loading, empty, error, retry, pagination | 3, 4, 6, 7   | No       |
| 6          | Rich Details - Markdown preview and badges             | 5, 7         | Yes      |
| 7          | Testing & Validation                                   | All          | No       |

---

## Tasks

- [ ] 1. Routing - Introduce React Router v7

- [ ] 1.1 Add React Router v7 dependency and route entry point
  - Add `react-router` v7 to dependencies.
  - Create `src/router/index.tsx` with `createBrowserRouter`.
  - Define route objects for `/`, `/callback`, `/app`, and `/releases`.
  - Use lazy route modules to preserve existing code-splitting behavior.
  - Replace `Authenticator` top-level conditional rendering with `RouterProvider`.
  - _Requirements: 1_
  - _GitHub Issue: #1266_

- [ ] 1.2 Move OAuth code exchange into `/callback`
  - Create `OAuthCallbackRoute` that reads the GitHub OAuth `code` query parameter.
  - Exchange the code through the existing `/login/oauth/access_token` endpoint.
  - Dispatch `login(access_token)` using the existing authenticator slice.
  - Redirect to `/app` with history replacement after successful login.
  - Show existing `FullScreenSpinner` while exchanging the token.
  - Handle failed token exchange by returning to `/` without exposing sensitive URL state.
  - _Requirements: 1_
  - _GitHub Issue: #1266_

- [ ] 1.3 Add authenticated layout route
  - Create `AuthenticatedLayout` that reads `authenticator.accessToken`.
  - Redirect unauthenticated `/app` and `/releases` visits to `/`.
  - Render persistent `AppShell` and `Outlet` when authenticated.
  - Keep the existing timeline view available at `/app`.
  - Add fallback handling for unknown routes.
  - _Requirements: 1, 2_
  - _GitHub Issue: #1266_

---

- [ ] 2. Navigation - Sidebar route switching

- [ ] 2.1 Add Sidebar navigation controls
  - Add route controls for timelines (`/app`) and Release Feed (`/releases`).
  - Use icon buttons with accessible labels and tooltips where useful.
  - Navigate with React Router APIs instead of manual `window.location` changes.
  - Preserve the existing subscribe modal button and account menu behavior.
  - _Requirements: 2, 7_
  - _GitHub Issue: #1267_

- [ ] 2.2 Add active route state
  - Use route state to highlight the active Sidebar control.
  - Expose active state with `aria-current="page"` or equivalent accessible state.
  - Verify Sidebar stays mounted while moving between `/app` and `/releases`.
  - Confirm browser back/forward navigation updates the active state.
  - _Requirements: 2, 7_
  - _GitHub Issue: #1267_

---

- [ ] 3. Data Layer - Fetch starred repository releases

- [ ] 3.1 Add GraphQL query for starred repository releases
  - Create `src/gql/getViewerStarredRepositoryReleases.graphql`.
  - Fetch `viewer.starredRepositories` with `pageInfo`, `totalCount`, and repository identity fields.
  - Fetch up to 5 recent releases per starred repository.
  - Include release id, title/name, tag, URL, description, prerelease/draft flags, and dates.
  - Include repository owner avatar and `nameWithOwner`.
  - _Requirements: 3, 4, 5_
  - _Contracts: GraphQL Query Contract (design.md)_
  - _GitHub Issue: #1268_

- [ ] 3.2 Generate and verify typed RTK Query hook
  - Run `pnpm codegen`.
  - Verify `useGetViewerStarredRepositoryReleasesQuery` is generated.
  - Confirm variables for `starredFirst`, `starredAfter`, and `releasesFirst`.
  - Confirm existing auth header behavior is reused through `src/constants/api.ts`.
  - _Requirements: 4_
  - _GitHub Issue: #1268_

- [ ] 3.3 Add release normalization helper
  - Flatten repository release nodes into `ReleaseFeedItem[]`.
  - Filter null nodes and draft releases.
  - Use `publishedAt ?? createdAt` for sorting.
  - Sort newest-first and dedupe by release id.
  - Add focused tests for sorting, fallback title, draft filtering, and null handling.
  - _Requirements: 3, 4, 5, 6_
  - _Contracts: ReleaseFeedItem Interface (design.md)_
  - _GitHub Issue: #1268_

---

- [ ] 4. Release Feed - Timeline view and cards

- [ ] 4.1 Create Release Feed route page
  - Create a route module for `/releases`.
  - Render heading "Release Feed" and supporting copy.
  - Fetch the first starred repository page through the generated hook.
  - Pass normalized release items into the feed list.
  - Keep content scrollable inside the existing authenticated shell.
  - _Requirements: 3, 4, 7_
  - _GitHub Issue: #1269_

- [ ] 4.2 Build release list and release card components
  - Render releases as a newest-first vertical timeline or list.
  - Show repository avatar, owner/name, release title, tag, and relative publish date.
  - Use release title fallback `name || tagName`.
  - Link each release to its GitHub release URL in a new tab.
  - Keep card layout responsive across mobile, tablet, and desktop.
  - _Requirements: 3, 5, 7_
  - _GitHub Issue: #1269_

- [ ] 4.3 Preserve existing timeline route
  - Extract the existing `TimelineContainer` route content if needed.
  - Ensure `/app` continues to render existing subscribed timelines.
  - Verify existing timeline E2E coverage still passes after routing changes.
  - _Requirements: 1, 2_
  - _GitHub Issue: #1269_

---

- [ ] 5. Feed States - Loading, empty, error, retry, pagination

- [ ] 5.1 Add initial loading and empty states
  - Show skeleton or spinner while first release page loads.
  - Show a "no starred repositories" state when `totalCount` is zero.
  - Show a "no releases found" state when starred repos exist but no releases remain after filtering.
  - Keep messages concise and action-oriented.
  - _Requirements: 3, 6, 7_
  - _GitHub Issue: #1270_

- [ ] 5.2 Add error and retry states
  - Show a user-friendly error state for network or GraphQL failures.
  - Add retry button that re-fetches the failed query.
  - Detect rate limit wording when available and show retry guidance.
  - Keep already loaded pages visible if pagination fails.
  - _Requirements: 4, 6, 7_
  - _GitHub Issue: #1270_

- [ ] 5.3 Add infinite scroll pagination
  - Track `pageInfo.endCursor` and `hasNextPage`.
  - Request additional starred repository pages when a bottom sentinel becomes visible.
  - Show bottom loading indicator while pagination is in progress.
  - Dedupe releases across pages.
  - Stop requesting pages when `hasNextPage` is false.
  - _Requirements: 4, 6, 7_
  - _GitHub Issue: #1270_

---

- [ ] 6. Rich Details - Markdown preview and badges

- [ ] 6.1 Add prerelease and metadata badges
  - Show "Pre-release" badge for `isPrerelease`.
  - Show tag name and relative date in a compact metadata row.
  - Ensure badge color works in light and dark theme.
  - _Requirements: 5, 7_
  - _GitHub Issue: #1271_

- [ ] 6.2 Add Markdown body preview
  - Render release description as Markdown with safe defaults.
  - Collapse preview to the first 3 lines by default.
  - Add expand/collapse button with accessible expanded state.
  - Omit preview UI when no description exists.
  - Add dependency only if an approved Markdown renderer is needed.
  - _Requirements: 5, 7_
  - _GitHub Issue: #1271_

- [ ] 6.3 Add accessible external release links
  - Give each external link an accessible name including repository and release title.
  - Use `target="_blank"` and safe `rel` attributes.
  - Confirm keyboard users can reach and activate release links.
  - _Requirements: 3, 5, 7_
  - _GitHub Issue: #1271_

---

- [ ] 7. Testing and Final Validation

- [ ] 7.1 Add routing and navigation E2E tests
  - Test unauthenticated `/releases` redirects to `/`.
  - Test authenticated `/app` renders the existing timeline view.
  - Test authenticated `/releases` renders the Release Feed view.
  - Test Sidebar navigation changes URL and active route state.
  - Test browser back/forward across `/app` and `/releases`.
  - _Requirements: 1, 2, 7_
  - _GitHub Issue: #1272_

- [ ] 7.2 Add release feed data E2E tests
  - Mock `getViewerStarredRepositoryReleases`.
  - Test multiple repositories with releases render newest-first.
  - Test release cards show repository name, tag, title, date, and prerelease badge.
  - Test release links point to GitHub release URLs.
  - _Requirements: 3, 4, 5_
  - _GitHub Issue: #1272_

- [ ] 7.3 Add feed state E2E tests
  - Test initial loading state.
  - Test no starred repositories state.
  - Test starred repositories with no releases state.
  - Test network error and retry behavior.
  - Test pagination loads next page when the bottom sentinel is reached.
  - _Requirements: 3, 4, 6, 7_
  - _GitHub Issue: #1272_

- [ ] 7.4 Run full validation suite
  - Run `pnpm codegen` after GraphQL query changes.
  - Run `pnpm typecheck`.
  - Run `pnpm lint`.
  - Run `pnpm validate`.
  - Run full Playwright E2E in CI.
  - Confirm CodeRabbit has no unresolved review threads before merge.
  - _Requirements: All_
  - _GitHub Issue: #1272_

---

## Requirements Coverage Matrix

| Requirement | Task(s)                                               | Coverage     |
| ----------- | ----------------------------------------------------- | ------------ |
| 1           | 1.1, 1.2, 1.3, 4.3, 7.1                               | Planned full |
| 2           | 1.3, 2.1, 2.2, 4.3, 7.1                               | Planned full |
| 3           | 3.1, 3.3, 4.1, 4.2, 5.1, 7.2, 7.3                     | Planned full |
| 4           | 3.1, 3.2, 3.3, 4.1, 5.2, 5.3, 7.2, 7.3                | Planned full |
| 5           | 3.1, 3.3, 4.2, 6.1, 6.2, 6.3, 7.2                     | Planned full |
| 6           | 3.3, 5.1, 5.2, 5.3, 7.3                               | Planned full |
| 7           | 2.1, 2.2, 4.1, 4.2, 5.1, 5.2, 6.1, 6.2, 6.3, 7.1, 7.3 | Planned full |

## Current Validation Status

This spec is implementation-ready as of 2026-06-24. The remaining implementation work is intentionally split across GitHub Issues #1266 through #1272 so routing, navigation, data, UI, states, details, and test coverage can land in reviewable increments.

## Parallel Execution Notes

Tasks marked as parallel-safe are limited because routing and data contracts are prerequisites for most UI work.

- Task 6 can start after Task 4 establishes the release card contract, even while Task 5 state handling continues.
- Task 7.1 can begin after Task 1 and Task 2.
- Task 7.2 can begin after Task 3 and Task 4.
- Task 7.3 can begin after Task 5.

**Recommended execution order:**

1. Task 1 - routing foundation.
2. Task 2 - Sidebar navigation on top of routes.
3. Task 3 - release data query and normalization.
4. Task 4 - base Release Feed view.
5. Task 5 and Task 6 - state handling and rich details.
6. Task 7 - E2E coverage and full validation.
