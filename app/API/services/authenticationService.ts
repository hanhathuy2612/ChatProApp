import { Api } from "app/API"
import { getGeneralApiProblem } from "../apiProblem"
import { BaseApiResponse, JWTToken, KIND, LoginRequest } from "../types"

class AuthenticationService extends Api {
  private readonly AUTH_URL = "api/authenticate"

  async login(req: LoginRequest): Promise<BaseApiResponse<JWTToken>> {
    const response = await this.apisauce.post<JWTToken>(`${this.AUTH_URL}/login`, req, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData: JWTToken | undefined = response.data
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
}

export const authenticationService = new AuthenticationService()
