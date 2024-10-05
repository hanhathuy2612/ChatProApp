import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { accountService, LoginRequest } from "app/services/accountService"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async login(request: LoginRequest) {
      const response = await accountService.login(request)
      if (response.status === 200) {
        store.setProp('authToken', response.data?.id_token)
        store.setProp('authEmail', request.username)
      }
    },
  }))
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {
}

export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {
}
