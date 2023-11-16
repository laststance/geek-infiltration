declare type TimelineProperty = {
  // TODO add id
  target: { user?: string; repo?: string }
  information: 'PR_Issues' | 'Discussion'
}
