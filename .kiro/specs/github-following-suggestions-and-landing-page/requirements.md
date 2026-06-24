# Requirements Document

## Project Description (Input)

カラーの追加ボタンに自分がGitHubでフォローしているアカウントのサジェスト表示を実装。表示名とIDですね。@でメンションとかに使うID両方サジェスチョン表示。ランディングページの作成、ファビコン、OGイメージなどのウェブアセット、メタデータの設定。

---

## Executive Summary

This feature consists of two major enhancements:

1. **GitHub Following Suggestions**: Add autocomplete suggestions showing users you follow when subscribing to new timelines
2. **Landing Page & Web Assets**: Create OG image, configure social sharing metadata, and enhance landing page

---

## Feature 1: GitHub Following Suggestions

### FR-1.1: User Following Autocomplete

**Description**: Replace the current manual text input in the subscription form with an autocomplete dropdown that suggests GitHub users the authenticated user follows.

**User Story**: As a user, I want to see GitHub users I follow as suggestions when adding a subscription, so I can quickly subscribe without typing usernames manually.

**Acceptance Criteria**:

- [ ] Autocomplete dropdown appears when user focuses on the username field
- [ ] Suggestions show users from the authenticated user's following list
- [ ] Each suggestion displays: avatar (32x32px), display name, and @username
- [ ] User can filter suggestions by typing (matches both name and login)
- [ ] User can still enter custom usernames not in their following list (freeSolo mode)
- [ ] Selected user's login populates the input field

### FR-1.2: GraphQL Query for Following List

**Description**: Create a new GraphQL query to fetch the authenticated user's following list.

**Query Structure**:

```graphql
query getViewerFollowing($first: Int = 100) {
  viewer {
    following(first: $first) {
      totalCount
      nodes {
        login
        name
        avatarUrl
      }
    }
  }
}
```

**Acceptance Criteria**:

- [ ] Query fetches user's following list via GitHub GraphQL API
- [ ] RTK Query hook `useGetViewerFollowingQuery` is generated via codegen
- [ ] Results are cached to minimize API calls
- [ ] For users following more than 100 accounts, the current scope fetches the first 100 accounts, exposes `totalCount` for awareness, and defers pagination UI/additional page fetching to a later spec

### FR-1.3: Autocomplete UI Component

**Description**: Implement MUI Autocomplete with custom option rendering.

**Technical Requirements**:

- Use the current `@mui/material` `Autocomplete` component from `package.json`
- `freeSolo={true}` to allow custom input
- `renderOption` for custom layout: Avatar + Name + @login
- `getOptionLabel` resolves the visible label from either a suggestion option or a freeSolo string
- Selection/input change handling writes the selected login or custom username string to the subscription form
- `filterOptions` for local filtering by name OR login
- Proper loading and empty states

**UI Mockup Structure**:

```
┌─────────────────────────────────────┐
│ @ [                              ▼] │
├─────────────────────────────────────┤
│ [Avatar] Display Name               │
│          @username                  │
├─────────────────────────────────────┤
│ [Avatar] Another User               │
│          @anotheruser               │
└─────────────────────────────────────┘
```

---

## Feature 2: Landing Page & Web Assets

### FR-2.1: Open Graph Metadata

**Description**: Add Open Graph and Twitter Card meta tags for proper social media sharing.

**Acceptance Criteria**:

- [ ] `og:title` set to "Geek Infiltration | GitHub Activity Visualization"
- [ ] `og:description` set to app value proposition (under 160 characters)
- [ ] `og:image` points to OG image asset (1200x630px)
- [ ] `og:url` set to production URL
- [ ] `og:type` set to "website"
- [ ] `twitter:card` set to "summary_large_image"
- [ ] `twitter:title`, `twitter:description`, `twitter:image` set appropriately

### FR-2.2: OG Image Asset

**Description**: Create Open Graph image for social media sharing.

**Specifications**:

- Dimensions: 1200x630px (optimal for all platforms)
- Format: PNG or JPG
- Content: App logo, tagline, visual representation of GitHub activity
- File location: `/public/og-image.png`
- Safe zone: Keep important content within center 80%

### FR-2.3: Landing Page Content Enhancement

**Description**: Ensure landing page effectively communicates the app's value proposition.

**Current State**: Landing page exists at `src/LandingPage/` with basic structure (Header, Home sections, Footer).

**Acceptance Criteria**:

- [ ] Hero section clearly states "GitHub Activity Visualization"
- [ ] Key features are highlighted (timeline aggregation, OAuth auth, subscriptions)
- [ ] Clear call-to-action for GitHub OAuth login
- [ ] Responsive design for mobile/tablet/desktop
- [ ] Follows Apple HIG design principles

---

## Non-Functional Requirements

### NFR-1: TypeScript Compliance

- All new code must pass TypeScript strict mode
- Proper type definitions for GraphQL response types
- No `any` types allowed

### NFR-2: Code Quality

- Follow existing project patterns (RTK Query, current MUI sx prop)
- Run codegen after adding GraphQL query
- ESLint and Prettier compliance
- Component memoization where appropriate

### NFR-3: Accessibility (WCAG 2.2 AA)

- Autocomplete must be keyboard navigable
- ARIA labels for all interactive elements
- Focus management for dropdown
- Minimum 44x44px tap targets
- Color contrast meets AA standards

### NFR-4: Performance

- Lazy load following list on component mount
- Cache following list to reduce API calls
- Optimize avatar image loading (lazy load)
- No blocking renders during data fetch

### NFR-5: Security

- OAuth token used for GraphQL queries
- No sensitive data in OG metadata
- Input sanitization for username field

---

## Technical Dependencies

| Dependency       | Version | Purpose                |
| ---------------- | ------- | ---------------------- |
| @mui/material    | ^9.1.2  | Autocomplete component |
| graphql-request  | ^7.4.0  | GraphQL data fetching  |
| @reduxjs/toolkit | ^2.12.0 | RTK Query hooks        |

---

## Affected Files

### New Files

- `src/gql/getViewerFollowing.graphql` - GraphQL query
- `public/og-image.png` - OG image asset

### Modified Files

- `src/app/Sidebar/SubscribeFormModal.tsx` - Replace TextField with Autocomplete
- `index.html` - Add OG meta tags
- `codegen.yml` - Include new GraphQL query (if needed)

### Generated Files (via codegen)

- `src/generated/graphql.ts` - Type definitions
- `src/generated/api.ts` - RTK Query hooks

---

## Out of Scope

- Pagination UI/additional page fetching for following list; this implementation fetches the first 100 accounts and retains `totalCount`
- Following list refresh/sync functionality
- User search beyond following list
- Landing page A/B testing
- Analytics integration

---

## Risks & Mitigations

| Risk                        | Probability | Impact | Mitigation                                                                                         |
| --------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------- |
| GitHub API rate limiting    | Medium      | High   | Cache results, batch requests                                                                      |
| Large following list (>100) | Low         | Medium | Limit to first 100 in this scope, retain totalCount, and track pagination as future work if needed |
| OAuth token expiry          | Low         | High   | Handle token refresh gracefully                                                                    |

---

## Validation Status

Validated on 2026-06-24 after PR #1274:

- `pnpm exec vitest run src/app/Sidebar/UserAutocomplete.test.ts src/app/Sidebar/UserAutocomplete.test.tsx`: 17 tests passed
- `pnpm typecheck`: passed
- `pnpm lint`: passed
- `pnpm validate`: passed, including the production build
- `pnpm exec playwright test --reporter=list`: 366 browser-expanded E2E tests passed across Chromium, Firefox, and WebKit
- Scope clarification: following suggestions intentionally cover the first 100 followed accounts only; pagination UI/additional page fetching remains out of scope

---

## Research References

- [MUI Autocomplete Documentation](https://mui.com/material-ui/react-autocomplete/)
- [GitHub GraphQL API Documentation](https://docs.github.com/en/graphql)
- [Open Graph Protocol](https://ogp.me/)

---

## Approval

- [ ] Requirements reviewed by stakeholder
- [ ] Technical feasibility confirmed
- [ ] Ready for design phase
