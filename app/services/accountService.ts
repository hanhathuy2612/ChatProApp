import { Api } from "app/services/api"
import { ApiResponse } from "apisauce"

export type LoginRequest = {
  username: string,
  password: string,
}

export type SignupRequest = {
  login: string,
  username: string,
  email: string,
  password: string,
  firstName: string,
  lastName: string,
}

export type JWTToken = {
  id_token: string
}

class AccountService extends Api {
  login(req: LoginRequest): Promise<ApiResponse<JWTToken>> {
    return this.apisauce.post(`api/account/login`, req, {
      headers: {
        "Content-Type": "application/json",
      }
    })
  }

  signup(req: SignupRequest) {
    return this.apisauce.post(`api/account`, req)
  }

  getContacts() {
    return this.apisauce.get(`api/account/contacts`)
  }
}

export const accountService = new AccountService()
