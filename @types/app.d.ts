import type { nanoid } from 'nanoid/non-secure'

declare global {
  type TimelineProperty = {
    id: ReturnType<typeof nanoid>
    target: { user?: string; repo?: string }
    information: 'PR_Issues' | 'Discussion'
  }
}
