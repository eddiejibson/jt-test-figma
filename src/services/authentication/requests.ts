import axios from 'axios'
import authenticationSession from '@utils/authenticationSession'
import { STORAGE_KEYS } from '@constants/storage'
import { request } from '@utils/request'
import { AuthenticationResponse } from '@interfaces/authentication'

export const handleRefreshToken = async (
  refreshToken: string,
  scope: string,
) => {
  try {
    const res = await request({
      url: '/oauth/token',
      method: 'POST',
      data: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: `${import.meta.env.APP_CLIENT_ID}`,
        client_secret: `${import.meta.env.APP_CLIENT_SECRET}`,
        scope: scope,
      },
    })

    localStorage.setItem(STORAGE_KEYS.TOKEN_CREATED_TIME, `${Date.now()}`)
    localStorage.setItem(STORAGE_KEYS.AUTHENTICATION, JSON.stringify(res.data))
    authenticationSession.setAuthentication(res.data)
    return authenticationSession.getAuthentication()
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      logout()
    }
    throw error
  }
}

export type ExampleAuthenticationRequestBody = {
  table: string
  username: string
}
export const exampleAuthentication = async (
  body: ExampleAuthenticationRequestBody,
): Promise<AuthenticationResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  // TODO: If used cookie just tored information without accessToken and refreshToken. Authentication will handle by cookie
  const result = {
    id: '1',
    resource_owner: 'User',
    resource_id: 1,
    access_token: '__THIS_IS_TOKEN__',
    refresh_token: '__THIS_IS_REFRESH_TOKEN__',
    expires_in: 10000000,
    token_type: 'Bearer',
    created_at: Date.now(),
    scope: body.table,
  }

  localStorage.setItem(STORAGE_KEYS.TOKEN_CREATED_TIME, `${Date.now()}`)
  localStorage.setItem(STORAGE_KEYS.AUTHENTICATION, JSON.stringify(result))
  authenticationSession.setAuthentication(result)
  return authenticationSession.getAuthentication() as AuthenticationResponse
}

export const logout = async () => {
  authenticationSession.clearAuthentication()
  localStorage.removeItem(STORAGE_KEYS.AUTHENTICATION)
  localStorage.removeItem(STORAGE_KEYS.TOKEN_CREATED_TIME)
}