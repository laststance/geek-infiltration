# Requirements Document

## Introduction

Add a Release Feed feature to Geek Infiltration that displays recent releases from the authenticated user's starred GitHub repositories in a chronological timeline. As a prerequisite, introduce React Router v7 to replace the current conditional rendering (`accessToken ? <App /> : <LandingPage />`) with URL-based routing, enabling multi-view navigation for the Release Feed and future features.

## Requirements

### Requirement 1: React Router v7 Integration

**Objective:** As a developer, I want URL-based routing with React Router v7, so that the app supports multiple views with proper URL paths and browser navigation (back/forward).

#### Acceptance Criteria

1. The App shall use `createBrowserRouter` and `RouterProvider` from React Router v7 as the top-level routing mechanism.
2. The Router shall define the following routes: `/` (Landing Page for unauthenticated users), `/app` (existing subscribed timelines view), `/releases` (Release Feed view), and `/callback` (OAuth callback handler).
3. The Router shall protect authenticated routes (`/app`, `/releases`) with a layout route that redirects unauthenticated users to `/`.
4. When a user completes OAuth authentication, the callback handler shall redirect to `/app`.
5. The Router shall support lazy loading of route components to maintain current code-splitting behavior.
6. When a user navigates using the browser back/forward buttons, the Router shall render the correct view.
7. The Router shall render a fallback loading indicator while lazy-loaded route components are being fetched.

### Requirement 2: Navigation and Access

**Objective:** As an authenticated user, I want to navigate between the timeline view and the Release Feed via the Sidebar, so that I can switch views seamlessly with URL changes.

#### Acceptance Criteria

1. The Sidebar shall provide navigation elements (icon buttons) for the timelines view (`/app`) and the Release Feed (`/releases`).
2. When the user clicks a Sidebar navigation element, the Router shall navigate to the corresponding URL path.
3. While a navigation element's route is active, the Sidebar shall visually indicate it as the current active view.
4. The App layout (Sidebar + content area) shall persist across route transitions without remounting the Sidebar.

### Requirement 3: Release Feed Timeline View

**Objective:** As an authenticated user, I want to see a chronological timeline of releases from my starred repositories, so that I can track software updates across all projects I follow in one place.

#### Acceptance Criteria

1. When the user navigates to `/releases`, the Release Feed shall display a vertical list of release entries sorted by publish date (newest first).
2. The Release Feed shall show the repository name, owner, release tag name, release title, and publish date for each entry.
3. When a release entry includes a release body (changelog/description), the Release Feed shall display a truncated preview of the content.
4. When the user clicks on a release entry, the Release Feed shall open the release page on GitHub in a new browser tab.
5. While release data is loading, the Release Feed shall display a loading skeleton or spinner indicator.
6. If no starred repositories have any releases, the Release Feed shall display an empty state message indicating no releases were found.

### Requirement 4: Data Fetching and Pagination

**Objective:** As an authenticated user, I want the release feed to load efficiently even when I have many starred repositories, so that the app remains responsive and performant.

#### Acceptance Criteria

1. The Release Feed shall fetch starred repositories and their recent releases using the GitHub GraphQL API via RTK Query.
2. The Release Feed shall initially load releases from the first batch of starred repositories (up to 50 repositories, up to 5 recent releases each).
3. When the user scrolls to the bottom of the release list, the Release Feed shall load additional starred repositories and their releases (infinite scroll pagination).
4. While additional releases are loading during pagination, the Release Feed shall display a loading indicator at the bottom of the list.
5. The Release Feed shall cache fetched release data using RTK Query's built-in caching to avoid redundant API calls.
6. If the GitHub API returns a rate limit error, the Release Feed shall display a user-friendly message indicating the rate limit and approximate wait time.

### Requirement 5: Release Entry Details

**Objective:** As an authenticated user, I want to see meaningful details about each release, so that I can quickly understand what changed without leaving the app.

#### Acceptance Criteria

1. Each release entry shall display: repository avatar (owner's avatar), repository full name (owner/name), release tag name, release title (or tag name as fallback), and relative publish date (e.g., "2 hours ago").
2. When a release is marked as a pre-release, the Release Feed shall display a visual badge indicating "Pre-release".
3. When a release has a body/description, the Release Feed shall display a collapsible preview (first 3 lines) with an expand/collapse toggle.
4. The Release Feed shall render release body content as Markdown.

### Requirement 6: Error Handling and Edge Cases

**Objective:** As an authenticated user, I want the feed to handle errors gracefully, so that I can understand issues and retry when needed.

#### Acceptance Criteria

1. If the GraphQL query fails due to a network error, the Release Feed shall display an error message with a retry button.
2. When the user clicks the retry button, the Release Feed shall re-fetch the release data.
3. If the authenticated user has no starred repositories, the Release Feed shall display a message guiding the user to star repositories on GitHub.
4. If a specific repository's releases fail to load, the Release Feed shall still display releases from other repositories that loaded successfully.

### Requirement 7: Visual Design and Responsiveness

**Objective:** As a user, I want the Release Feed to match the existing app's visual style and work across screen sizes, so that the experience feels cohesive.

#### Acceptance Criteria

1. The Release Feed shall use MUI v7 components and the existing application theme for consistent visual styling.
2. The Release Feed layout shall be responsive, adapting appropriately to different viewport widths.
3. The Release Feed shall support both light and dark themes as defined by the existing application theme.
4. While the system has `prefers-reduced-motion` enabled, the Release Feed shall disable or reduce animations.
