import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

import { GITHUB_GRAPHQL_ENDPOINT } from './endpoint'

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: GITHUB_GRAPHQL_ENDPOINT,
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
})
