import { BaseApiResponse, KIND, LoginRequest, TokenResponse } from "app/API"
import { REFRESH_TOKEN } from "app/constants/key-stored.constant"
import { loadString } from "app/utils/storage"
import { defaultApiSauce } from "../api"
import { getGeneralApiProblem } from "../apiProblem"

class AuthenticationService {
  private readonly AUTH_URL = "api/authenticate"

  async login(req: LoginRequest): Promise<BaseApiResponse<TokenResponse>> {
    const response = await defaultApiSauce.post<TokenResponse>(`${this.AUTH_URL}/login`, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData: TokenResponse | undefined = response.data
      if (!rawData) {
        return { kind: KIND.BAD_DATA }
      }
      return { kind: KIND.OK, data: rawData }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: KIND.BAD_DATA }
    }
  }

  async refreshToken(): Promise<BaseApiResponse<TokenResponse>> {
    try {
      const refreshToken = await loadString(REFRESH_TOKEN)

      if (!refreshToken) {
        return { kind: KIND.UNAUTHORIZED }
      }

      const response = await defaultApiSauce.post<TokenResponse>(
        `${this.AUTH_URL}/refresh-token`,
        { refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )

      if (!response.ok) {
        const problem = getGeneralApiProblem(response)
        if (problem) return problem
      }

      try {
        const rawData: TokenResponse | undefined = response.data
        if (!rawData) {
          return { kind: KIND.BAD_DATA }
        }
        return { kind: KIND.OK, data: rawData }
      } catch (e) {
        if (__DEV__ && e instanceof Error) {
          console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
        }
        return { kind: KIND.BAD_DATA }
      }
    } catch (error) {
      console.error("Error refreshing token:", error)
      return { kind: KIND.UNKNOWN, temporary: true }
    }
  }
}

export const authenticationService = new AuthenticationService()
