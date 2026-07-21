/** One activity item shown in a developer's board column (idealized static marketing mock). */
export interface BoardColumn {
  /** Column owner's GitHub login (a developer you follow). */
  owner: string
  /** Repository the activity happened in, e.g. "facebook/react". */
  repo: string
  /** Whether the item is a pull request or an issue — drives badge icon/color. */
  kind: 'pr' | 'issue'
  /** Human reference like "PR #28950" / "Issue #994". */
  reference: string
  /** Item title. */
  title: string
  /** Commenter's GitHub login (avatar + @handle on the item). */
  commenter: string
  /** Relative timestamp copy, e.g. "2h ago". */
  timeAgo: string
  /** One short comment line. */
  comment: string
}

/**
 * Static, idealized board content for the hero mock. Deliberately NOT live data:
 * the real product UI evolves, so this marketing board is hand-authored to always
 * look intentional. Owners and commenters are drawn from the project's public
 * GitHub fixture allowlist. Consumed only by <MockBoard />.
 * @example BOARD_COLUMNS[0].owner // => "gaearon"
 */
export const BOARD_COLUMNS: readonly BoardColumn[] = [
  {
    owner: 'gaearon',
    repo: 'facebook/react',
    kind: 'pr',
    reference: 'PR #28950',
    title: 'Refactor act() to be async by default',
    commenter: 'eps1lon',
    timeAgo: '2h ago',
    comment: 'Makes sense. The warnings are much clearer now. 👍',
  },
  {
    owner: 'sindresorhus',
    repo: 'sindresorhus/ky',
    kind: 'issue',
    reference: 'Issue #994',
    title: 'Add support for fetch priority',
    commenter: 'phryneas',
    timeAgo: '3h ago',
    comment: 'Agree this is useful. Happy to review a PR for this.',
  },
  {
    owner: 'kentcdodds',
    repo: 'testing-library/dom',
    kind: 'pr',
    reference: 'PR #1172',
    title: 'feat: add `screen.debug()` limit option',
    commenter: 'kettanaito',
    timeAgo: '1h ago',
    comment: 'Love it. This will help a lot with large DOM trees.',
  },
  {
    owner: 'antfu',
    repo: 'antfu/vite-plugin-inspect',
    kind: 'issue',
    reference: 'Issue #167',
    title: 'Support filter by transformed modules',
    commenter: 'IanVS',
    timeAgo: '4h ago',
    comment: "Good idea! I'll add a filter box to the UI. Thanks!",
  },
] as const
