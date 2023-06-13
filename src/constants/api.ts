import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'

import type { RootState } from '../store'

import { endpoint } from './endpoint'

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    prepareHeaders: (headers: Headers, { getState }) => {
      const accessToken = (getState() as RootState).authenticator.accessToken
      headers.set('Authorization', `Bearer ${accessToken}`)
      return headers
    },
    url: endpoint,
  }),
  endpoints: () => ({}),
  reducerPath: 'api',
})
