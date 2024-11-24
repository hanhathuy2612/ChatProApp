import { ApiResponse } from "apisauce"
import { Api } from "app/services/api"

export type JWTToken = {
  id_token: string
}

export type LoginRequest = {
  username: string
  password: string
}

class AuthenticationService extends Api {
  private readonly AUTH_URL = "api/authenticate"

  login(req: LoginRequest): Promise<ApiResponse<JWTToken>> {
    return this.apisauce.post(`${this.AUTH_URL}/login`, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

export const authenticationService = new AuthenticationService()
