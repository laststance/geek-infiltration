import { request, gql } from 'graphql-request'
import React from 'react'
import { useQuery } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

import getIssueCommentByUsername from './gql/getIssueCommentByUsername'

const endpoint = 'https://api.github.com/graphql'

function App() {
  const { status, data, error, isFetching } = useIssue()
  return (
    <>
      <p>
        As you visit the posts below, you will notice them in a loading state
        the first time you load them. However, after you return to this list and
        click on any posts you have already visited again, you will see them
        load instantly and background refresh right before your eyes!{' '}
        <strong>
          (You may need to throttle your network speed to simulate longer
          loading sequences)
        </strong>
      </p>
      <ReactQueryDevtools initialIsOpen />
    </>
  )
}

function useIssue() {
  return useQuery(['issues'], async () => {
    const {
      issues: { data },
    } = await request(endpoint, getIssueCommentByUsername, null, {
      authorization: 'Bearer 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',
    })
    return data
  })
}

export default App
