# Implementation Plan

## Task Overview

| Major Task | Description                           | Requirements  | Parallel |
| ---------- | ------------------------------------- | ------------- | -------- |
| 1          | Data Layer - Following List Query     | 1.2           | No       |
| 2          | UI Component - UserAutocomplete       | 1.1, 1.3      | No       |
| 3          | Form Integration - SubscribeFormModal | 1.1           | No       |
| 4          | Web Assets - Open Graph & Metadata    | 2.1, 2.2, 2.3 | Yes      |
| 5          | Testing & Validation                  | All           | No       |

---

## Tasks

- [x] 1. Data Layer - Fetch Authenticated User's Following List

- [x] 1.1 Create GraphQL query to retrieve the viewer's following list
  - Define a query that fetches login, display name, and avatar URL for each followed user
  - Limit initial fetch to first 100 users (covers majority of use cases)
  - Include totalCount for awareness of pagination needs
  - Ensure query uses viewer context (authenticated user scope)
  - _Requirements: 1.2_

- [x] 1.2 Generate type-safe RTK Query hooks via codegen
  - Run GraphQL codegen to produce TypeScript types and RTK Query hooks
  - Verify hook `useGetViewerFollowingQuery` is generated correctly
  - Confirm response types match expected structure (FollowingUser interface)
  - Validate caching behavior is enabled by default
  - _Requirements: 1.2_

---

- [x] 2. UI Component - UserAutocomplete with Following Suggestions

- [x] 2.1 Build autocomplete dropdown displaying followed users
  - Create component that shows avatar (32x32px), display name, and @username for each suggestion
  - Enable local filtering by both name and login as user types
  - Support freeSolo mode allowing entry of usernames not in following list
  - Handle loading state while fetching following list
  - Show "No suggestions available" placeholder when following list is empty
  - Ensure keyboard navigation works correctly (arrow keys, enter to select)
  - _Requirements: 1.1, 1.3_
  - _Contracts: Props Interface (design.md)_

- [x] 2.2 Integrate accessibility features for autocomplete
  - Add appropriate ARIA labels for screen readers
  - Ensure minimum 44x44px tap targets for mobile interaction
  - Verify focus management when dropdown opens/closes
  - Maintain color contrast meeting WCAG 2.2 AA standards
  - _Requirements: 1.1, 1.3, NFR-3_

---

- [ ] 3. Form Integration - Replace Manual Input with Autocomplete

- [ ] 3.1 Wire UserAutocomplete into subscription form
  - Replace existing text input field with the new autocomplete component
  - Connect to react-hook-form Controller for form state management
  - Preserve existing form validation (required field)
  - Ensure selected username populates correctly for form submission
  - Maintain radio button selection for information type
  - _Requirements: 1.1_
  - _Contracts: SubscribeFormModal (design.md)_

---

- [ ] 4. Web Assets - Open Graph Metadata and Social Sharing

- [ ] 4.1 (P) Add Open Graph and Twitter Card meta tags
  - Set og:title to "Geek Infiltration | GitHub Activity Visualization"
  - Write compelling og:description (under 160 characters) communicating value proposition
  - Configure og:image pointing to OG image asset
  - Set og:url to production URL and og:type to "website"
  - Add Twitter Card meta tags (summary_large_image format)
  - _Requirements: 2.1_
  - _Contracts: Meta Tags Specification (design.md)_

- [ ] 4.2 (P) Create branded OG image asset for social sharing
  - Design 1200x630px image (optimal for all platforms)
  - Include app branding and visual representation of GitHub activity
  - Keep important content within center 80% safe zone
  - Save as PNG format in public directory
  - _Requirements: 2.2_

- [ ] 4.3 (P) Verify landing page content alignment
  - Ensure hero section clearly communicates "GitHub Activity Visualization"
  - Verify key features are highlighted (timeline aggregation, OAuth auth, subscriptions)
  - Confirm call-to-action for GitHub OAuth login is prominent
  - Check responsive design across mobile/tablet/desktop breakpoints
  - _Requirements: 2.3_

---

- [ ] 5. Testing and Final Validation

- [ ] 5.1 Write unit tests for UserAutocomplete component
  - Test component renders with loading state
  - Test filtering works by both name and login
  - Test onChange callback receives selected user's login
  - Test freeSolo mode accepts custom input
  - Test empty following list shows placeholder
  - _Requirements: 1.1, 1.3, NFR-2_

- [ ] 5.2 Create E2E tests for complete subscription flow
  - Test user opens modal and sees following suggestions
  - Test selecting a suggestion submits form successfully
  - Test entering custom username works correctly
  - Test OG meta tags present in page source
  - Test OG image loads at correct URL
  - _Requirements: 1.1, 2.1, 2.2_

- [ ] 5.3 Run full validation suite
  - Execute TypeScript type checking (strict mode)
  - Run ESLint and Prettier checks
  - Execute build to verify no compilation errors
  - Run complete E2E test suite
  - _Requirements: NFR-1, NFR-2_

---

## Requirements Coverage Matrix

| Requirement | Task(s)                 | Coverage                        |
| ----------- | ----------------------- | ------------------------------- |
| 1.1         | 2.1, 2.2, 3.1, 5.1, 5.2 | ✅ Full                         |
| 1.2         | 1.1, 1.2                | ✅ Full                         |
| 1.3         | 2.1, 2.2, 5.1           | ✅ Full                         |
| 2.1         | 4.1, 5.2                | ✅ Full                         |
| 2.2         | 4.2, 5.2                | ✅ Full                         |
| 2.3         | 4.3                     | ✅ Full                         |
| NFR-1       | 5.3                     | ✅ Cross-cutting                |
| NFR-2       | 5.1, 5.3                | ✅ Cross-cutting                |
| NFR-3       | 2.2                     | ✅ Addressed                    |
| NFR-4       | 1.2, 2.1                | ✅ Built-in (RTK Query caching) |
| NFR-5       | All                     | ✅ Built-in (existing patterns) |

---

## Parallel Execution Notes

Tasks marked with `(P)` can be executed concurrently:

- **4.1, 4.2, 4.3**: Web asset tasks have no dependency on autocomplete implementation
- These tasks modify different files (index.html, public/og-image.png) than Feature 1 tasks (src/gql, src/app/Sidebar)

**Recommended execution order:**

1. Start Task 1 (Data Layer) - foundation
2. Start Tasks 4.1, 4.2, 4.3 in parallel - no dependencies
3. Task 2 after Task 1 completes - needs generated hooks
4. Task 3 after Task 2 completes - needs UserAutocomplete
5. Task 5 after all others - final validation
