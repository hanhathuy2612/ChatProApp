import { ApiResponse } from "apisauce"
import { AppUser } from "app/models/User"
import { Api } from "app/services/api"

export type SignupRequest = {
  login: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

class AccountService extends Api {
  signup(req: SignupRequest) {
    return this.apisauce.post(`api/account`, req)
  }

  getContacts(): Promise<ApiResponse<AppUser[]>> {
    return this.apisauce.get<AppUser[]>(`api/account/contacts`)
  }

  addContact(appUser: AppUser) {
    return this.apisauce.post<AppUser[]>(`api/account/contacts`, appUser)
  }

  fetchAccount(): Promise<ApiResponse<AppUser>> {
    return this.apisauce.get<AppUser>(`api/account`)
  }
}

export const accountService = new AccountService()
