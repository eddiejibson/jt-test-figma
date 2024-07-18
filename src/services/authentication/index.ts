import { useEffect, useState } from 'react'
import { useMutation, MutateOptions, UseMutationOptions } from 'react-query'

import {
  ExampleAuthenticationRequestBody,
  exampleAuthentication,
  logout,
} from './requests'
import authenticationSession from '@utils/authenticationSession'
import { AuthenticationResponse } from '@interfaces/authentication'

export const useAuthenticationData = () => {
  const [, setTrigger] = useState(0)

  useEffect(() => {
    const listener = authenticationSession.addListener(() => {
      setTrigger((prev) => prev + 1)
    })
    return () => {
      if (typeof listener === 'function') {
        listener()
      }
    }
  }, [])

  return authenticationSession.getAuthentication()
}

export const useLogoutMutation = (
  options: MutateOptions<unknown, unknown, unknown, unknown> = {},
) => useMutation(logout, options)

export const useExampleAuthenticationMutation = (
  options?: UseMutationOptions<
    AuthenticationResponse | null | undefined,
    unknown,
    ExampleAuthenticationRequestBody,
    unknown
  >,
) => {
  return useMutation<
    AuthenticationResponse | null | undefined,
    unknown,
    ExampleAuthenticationRequestBody,
    unknown
  >(exampleAuthentication, options)
}