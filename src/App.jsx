import { useAtomValue } from 'jotai'
import React from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'

import { accessTokenAtom } from './atom'
import { useGetIssueCommentsQuery } from './generated/graphql'

const endpoint = 'https://api.github.com/graphql'

function App() {
  const accessToken = useAtomValue(accessTokenAtom)
  const { status, data, error, isFetching } = useGetIssueCommentsQuery(
    {
      endpoint: endpoint,
      fetchParams: { headers: { authorization: `Bearer ${accessToken}` } },
    },
    { query: 'markerikson' }
  )
  console.log(status, data, error, isFetching)
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

export default App
