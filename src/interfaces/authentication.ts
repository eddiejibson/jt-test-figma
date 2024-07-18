export type AuthenticationResponse = {
  access_token?: string
  refresh_token?: string
  resource_owner: string
  resource_id: number | string
  token_type: string
  expires_in?: number
  created_at: number
  scope: string
  id: number | string
}