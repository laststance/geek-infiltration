import {
  CircularProgress,
  Box,
  List,
  ListItem,
  Typography as Text,
} from '@mui/material'
import React, { memo } from 'react'

import CommentCard from '../../../components/CommentCard'
import { useGetDiscussionCommentsQuery } from '../../../generated/graphql'
import type { DiscussionComment, Actor } from '../../../generated/graphql'

interface Props {
  username: string
}

const DiscussionComments: React.FC<Props> = memo(({ username }) => {
  const { data, isLoading, isFetching, isSuccess, error } =
    useGetDiscussionCommentsQuery({
      query: username,
    })

  if (error) return <Text>Error in fetch from Github API.</Text>

  if (isLoading || isFetching)
    return (
      <Box style={{ paddingTop: '20px', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </Box>
    )

  if (isSuccess && data) {
    // @ts-expect-error broken generated type
    const nodeList = data.search.edges[0].node.repositoryDiscussionComments
      .edges as Array<{
      node: DiscussionComment
    }>
    return (
      <List sx={{ bgcolor: 'background.paper', width: '100%' }}>
        {nodeList.map(
          (
            { node: { author, bodyHTML, publishedAt, url, discussion } },
            i: number
          ) => (
            <ListItem disableGutters style={{ padding: '8px' }} key={i}>
              <CommentCard
                author={author as Actor}
                repositoryName={discussion!.repository.nameWithOwner}
                bodyHTML={bodyHTML}
                commentLink={url}
                publishedAt={publishedAt}
                ticketAuthorName={discussion!.author!.login}
                ticketLink={discussion!.url}
                ticketTitle={discussion!.title}
              />
            </ListItem>
          )
        )}
      </List>
    )
  }

  return <Text>Faild data loading.</Text>
})
DiscussionComments.displayName = 'DiscussionCommentsTimeline'

export default DiscussionComments
