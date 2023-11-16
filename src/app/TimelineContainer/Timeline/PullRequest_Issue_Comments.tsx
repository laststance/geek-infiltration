import {
  CircularProgress,
  Box,
  List,
  ListItem,
  Typography as Text,
} from '@mui/material'
import React, { memo } from 'react'

import CommentCard from '@/components/CommentCard'
import { useGetIssueCommentsQuery } from '@/generated/graphql'
import type { IssueComment, Actor } from '@/generated/graphql'

interface Props {
  user: NonNullable<TimelineProperty['target']['user']>
}

/**
 * I initially wanted to get PR and Issue comments separately,
 * But the Github API spec does not distinguish between them.
 * So currently I can only view them at the same time.
 */
const PullRequest_Issue_Comments: React.FC<Props> = memo(({ user }) => {
  const { data, error, isFetching, isLoading, isSuccess } =
    useGetIssueCommentsQuery({
      query: user,
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
    const nodeList = data.search.edges[0].node!.issueComments.edges as Array<{
      node: IssueComment
    }>
    return (
      <List
        sx={{
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column-reverse',
          paddingTop: 0,
          width: '100%',
        }}
        component="ul"
      >
        {nodeList.map(
          (
            { node: { author, bodyHTML, issue, publishedAt, repository, url } },
            i: number,
          ) => (
            <ListItem disableGutters key={i} component="li">
              <CommentCard
                author={author as Actor}
                repositoryName={repository.nameWithOwner}
                bodyHTML={bodyHTML}
                commentLink={url}
                publishedAt={publishedAt}
                ticketAuthorName={issue.author!.login}
                ticketLink={issue.url}
                ticketTitle={issue.title}
              />
            </ListItem>
          ),
        )}
      </List>
    )
  }

  return <Text>Faild data loding.</Text>
})
PullRequest_Issue_Comments.displayName = 'RullRequest_Issue_Comments'

export default PullRequest_Issue_Comments
