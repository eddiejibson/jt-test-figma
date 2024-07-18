import axios from 'axios'
import authenticationSession from '@utils/authenticationSession'
import { handleRefreshToken } from '@services/authentication/requests'
import { AuthenticationResponse } from '@interfaces/authentication'

export const request = axios.create()

request.interceptors.request.use(function (config) {
  config.baseURL = import.meta.env.VITE_API_URL
  config.headers['Accept'] = 'application/json'
  return config
})

export const requestAuthenticated = axios.create()
let refreshProcess: Promise<AuthenticationResponse | undefined> | undefined

requestAuthenticated.interceptors.request.use(async function (config) {
  if (authenticationSession.initialProcessing()) {
    await authenticationSession.initialProcessing()
  }

  let authenticationInfo = authenticationSession.getAuthentication()

  if (refreshProcess) {
    authenticationInfo = await refreshProcess
  }

  config.baseURL = import.meta.env.VITE_API_URL
  config.headers['Accept'] = 'application/json'

  if (!authenticationInfo) {
    return config
  }
  config.headers['Accept'] = 'application/json'
  if (authenticationInfo?.access_token) {
    config.headers['Authorization'] =
      `Bearer ${authenticationInfo.access_token}`
  }
  return config
})

requestAuthenticated.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    let authenticationInfo = authenticationSession.getAuthentication()
    // Try to refresh token in this case
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config &&
      !('_retry' in error.config && !error.config._retry) &&
      authenticationInfo?.refresh_token
    ) {
      // @ts-ignore
      error.config._retry = true
      authenticationInfo = await refreshProcessHandler(authenticationInfo)
      if (error.config?.headers && authenticationInfo?.access_token) {
        error.config.headers['Authorization'] =
          `Bearer ${authenticationInfo.access_token}`
      } else {
        Promise.reject(error)
      }
      return request.request(error.config || {})
    }
    return Promise.reject(error)
  },
)

async function refreshProcessHandler(
  authenticationInfo: AuthenticationResponse | undefined,
) {
  if (!authenticationInfo?.refresh_token || authenticationInfo?.scope) {
    return
  }
  if (!refreshProcess) {
    refreshProcess = handleRefreshToken(
      `${authenticationInfo.refresh_token}`,
      `${authenticationInfo.scope}`,
    ).then((result) => {
      refreshProcess = undefined
      return result
    })
  }
  return refreshProcess
}