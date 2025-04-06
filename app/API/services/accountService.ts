import { ApiResponse } from "apisauce"
import { SignupRequest, User } from "app/API/types"
import { defaultApiSauce } from "../api"

class AccountService {
  signup(req: SignupRequest) {
    return defaultApiSauce.post(`api/account`, req)
  }

  getContacts(): Promise<ApiResponse<User[]>> {
    return defaultApiSauce.get<User[]>(`api/account/contacts`)
  }

  addContact(user: User) {
    return defaultApiSauce.post<User[]>(`api/account/contacts`, user)
  }

  fetchAccount(): Promise<ApiResponse<User>> {
    return defaultApiSauce.get<User>(`api/account`)
  }
}

export const accountService = new AccountService()
