# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0.0] - 2026-07-21

### Added

- Brand-new landing page built around reading the primary source — follow real developers' pull requests, issues, and discussions instead of a social feed.
- Hero preview board showing an idealized activity stream, with a swipeable, keyboard-navigable column layout on mobile.
- Feature section explaining timeline aggregation, subscriptions, and GitHub OAuth login.
- "Noise vs. source" comparison and a terminal-style call-to-action inviting you to sign in.
- Self-hosted Geist and Geist Mono typefaces, so the page no longer depends on external font requests.
- A dark, GitHub-native color system exposed as reusable design tokens.
- Entrance and green-glow motion that automatically calms itself for visitors who prefer reduced motion.
- Unit tests covering the board interactions, reveal animations, and reduced-motion behavior.

### Changed

- Rebuilt the landing experience to the approved refine-1 design.
- Strengthened accessibility: a valid heading outline, larger mobile tap targets (WCAG 2.5.8), and reduced-motion-safe page-dot scrolling.
- Updated the authentication end-to-end test to match the refined hero and feature copy.

### Fixed

- The GitHub OAuth feature card no longer claims "read-only access," which overstated the granted permission.
- Supporting body copy now meets the minimum readable size and contrast.

### Removed

- Retired the old MUI "Minimal" template: marketing illustrations, plan icons, animation variants, legacy style helpers, and unused types.
