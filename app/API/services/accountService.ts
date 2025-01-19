import { ApiResponse } from "apisauce"
import { Api } from "app/API"
import { SignupRequest, User } from "app/API/types"

class AccountService extends Api {
  signup(req: SignupRequest) {
    return this.apisauce.post(`api/account`, req)
  }

  getContacts(): Promise<ApiResponse<User[]>> {
    return this.apisauce.get<User[]>(`api/account/contacts`)
  }

  addContact(user: User) {
    return this.apisauce.post<User[]>(`api/account/contacts`, user)
  }

  fetchAccount(): Promise<ApiResponse<User>> {
    return this.apisauce.get<User>(`api/account`)
  }
}

export const accountService = new AccountService()
