import '@styles/globals.css'

import { useMemo, FunctionComponent, useEffect, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { RouterProvider } from 'react-router-dom'
import { INITIAL_QUERY_OPTIONS } from '@constants/query'
import AppProvider from '@components/AppProvider'

import routes from './routes'
import authenticationSession from '@utils/authenticationSession'

export const App: FunctionComponent = () => {
  const [sessionReady, setSessionReady] = useState(
    authenticationSession.synchronously,
  )
  const queryClient = useMemo(() => new QueryClient(INITIAL_QUERY_OPTIONS), [])

  useEffect(() => {
    authenticationSession.init().then(() => {
      if (!authenticationSession.synchronously) {
        setSessionReady(true)
      }
    })
  }, [])
  const app = useMemo(() => {
    if (!sessionReady) {
      return null
    }
    return <AppProvider />
  }, [sessionReady])
  return (
    <ErrorBoundary
      FallbackComponent={() => null}
      onReset={() => {
        // reset the state of your app here
      }}
      resetKeys={['reset_key']}
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
        {app}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}