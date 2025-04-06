export type LoginRequest = {
  username: string
  password: string
}

export type TokenResponse = {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}
