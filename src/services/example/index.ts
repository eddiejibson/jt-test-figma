import { useQuery, UseQueryOptions } from 'react-query'

import { getExamples, GetExamplesParamsType } from './requests'

export const EXAMPLE_QUERY_KEYS = {
  GET_EXAMPLES: 'GET_EXAMPLES',
}

export const useQueryExamples = (
  params: GetExamplesParamsType = {},
  options: UseQueryOptions<any, unknown, any, string[]> = {},
) => {
  return useQuery({
    ...options,
    queryKey: [EXAMPLE_QUERY_KEYS.GET_EXAMPLES, JSON.stringify(params)],
    queryFn: () => getExamples(params),
  })
}