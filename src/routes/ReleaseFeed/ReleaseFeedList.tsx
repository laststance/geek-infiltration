import { Box, Stack } from '@mui/material'
import { memo } from 'react'

import type { ReleaseFeedItem } from './normalizeReleaseFeedItems'
import { ReleaseFeedCard } from './ReleaseFeedCard'

interface ReleaseFeedListProps {
  items: readonly ReleaseFeedItem[]
}

/**
 * Renders normalized releases newest-first after the Release Feed route fetches data.
 * @param items - Sorted release feed items from the route normalizer.
 * @returns An ordered list of release cards.
 * @example
 * <ReleaseFeedList items={items} />
 */
export const ReleaseFeedList = memo(({ items }: ReleaseFeedListProps) => {
  return (
    <Stack
      aria-label="Release Feed entries"
      component="ol"
      spacing={2}
      sx={{ listStyle: 'none', m: 0, p: 0 }}
    >
      {items.map((item) => (
        <Box component="li" key={item.id}>
          <ReleaseFeedCard item={item} />
        </Box>
      ))}
    </Stack>
  )
})
ReleaseFeedList.displayName = 'ReleaseFeedList'
