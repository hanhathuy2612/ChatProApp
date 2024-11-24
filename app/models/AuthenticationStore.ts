import { getRootStore } from "app/models/helpers/getRootStore"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { authenticationService, LoginRequest } from "app/services/authenticationService"
import { Instance, SnapshotOut, types } from "mobx-state-tree"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async login(request: LoginRequest) {
      const response = await authenticationService.login(request)
      if (response.status === 200) {
        store.setProp("authToken", response.data?.id_token)
        store.setProp("authEmail", request.username)

        const rootStore = getRootStore(store)

        rootStore.accountStore.fetchAccount()
      }
    },
  }))
  .views((store) => ({
    get isAuthenticated() {
      console.log("store.authEmail: ", store.authEmail)
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

export type AuthenticationStore = Instance<typeof AuthenticationStoreModel>

export type AuthenticationStoreSnapshot = SnapshotOut<typeof AuthenticationStoreModel>
