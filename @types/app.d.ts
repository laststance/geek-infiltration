import type { nanoid } from 'nanoid/non-secure'

import type { NonEmptyObject } from '@types/non-empty-object'

declare global {
  type TimelineProperty = {
    id: ReturnType<typeof nanoid>
    aim: NonEmptyObject<{ user?: string; repo?: string }>
    information: 'PR_Issues' | 'Discussion'
  }
}
