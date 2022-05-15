import { request, gql } from 'graphql-request'
import React from 'react'
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient()

const endpoint = 'https://graphqlzero.almansi.me/api'

function App() {
  const [postId, setPostId] = React.useState(-1)

  return (
    <QueryClientProvider client={queryClient}>
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
      {postId > -1 ? (
        <Post postId={postId} setPostId={setPostId} />
      ) : (
        <Posts setPostId={setPostId} />
      )}
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  )
}

function usePosts() {
  return useQuery('posts', async () => {
    const {
      posts: { data },
    } = await request(
      endpoint,
      gql`
        query {
          posts {
            data {
              id
              title
            }
          }
        }
      `
    )
    return data
  })
}

function Posts({ setPostId }) {
  const queryClient = useQueryClient()
  const { status, data, error, isFetching } = usePosts()

  return (
    <div>
      <h1>Posts</h1>
      <div>
        {status === 'loading' ? (
          'Loading...'
        ) : status === 'error' ? (
          <span>Error: {error.message}</span>
        ) : (
          <>
            <div>
              {data.map((post) => (
                <p key={post.id}>
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a
                    onClick={() => setPostId(post.id)}
                    href="#"
                    style={
                      // We can find the existing query data here to show bold links for
                      // ones that are cached
                      queryClient.getQueryData(['post', post.id])
                        ? {
                            color: 'green',
                            fontWeight: 'bold',
                          }
                        : {}
                    }
                  >
                    {post.title}
                  </a>
                </p>
              ))}
            </div>
            <div>{isFetching ? 'Background Updating...' : ' '}</div>
          </>
        )}
      </div>
    </div>
  )
}

function usePost(postId) {
  return useQuery(
    ['post', postId],
    async () => {
      const { post } = await request(
        endpoint,
        gql`
          query {
            post(id: ${postId}) {
              id
              title
              body
            }
          }
        `
      )

      return post
    },
    {
      enabled: !!postId,
    }
  )
}

function Post({ postId, setPostId }) {
  const { status, data, error, isFetching } = usePost(postId)

  return (
    <div>
      <div>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={() => setPostId(-1)} href="#">
          Back
        </a>
      </div>
      {!postId || status === 'loading' ? (
        'Loading...'
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <h1>{data.title}</h1>
          <div>
            <p>{data.body}</p>
          </div>
          <div>{isFetching ? 'Background Updating...' : ' '}</div>
        </>
      )}
    </div>
  )
}

export default App
