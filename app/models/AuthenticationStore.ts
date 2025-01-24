import { getRootStore } from "app/models/helpers/getRootStore"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { KIND, LoginRequest } from "app/API/types"
import { authenticationService } from "app/API/services/authenticationService"
import { saveString } from "app/utils/storage"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
    status: types.optional(types.enumeration(["idle", "pending", "done", "error"]), "idle"),
    error: types.maybe(types.string),
  })
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
  .actions(withSetPropAction)
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
  .actions((store) => ({
    async login(request: LoginRequest) {
      try {
        store.setProp("status", "pending")
        store.setProp("error", undefined)

        const response = await authenticationService.login(request)
        console.log(response)
        if (response.kind === KIND.OK && response.data) {
          await this.handleLoginSuccess(response.data.id_token, request.username)
          store.setProp("status", "done")
        } else {
          throw new Error("Login failed")
        }
      } catch (error) {
        console.error(error)
        store.setProp("status", "error")
        store.setProp("error", (error as Error).message)
        throw error
      }
    },

    async handleLoginSuccess(token: string, email: string) {
      store.setProp("authToken", token)
      store.setProp("authEmail", email)

      await Promise.all([saveString("authToken", token), saveString("authEmail", email)])

      const rootStore = getRootStore(store)
      rootStore.accountStore.fetchAccount()
    },

    logout() {
      store.setProp("authToken", undefined)
      store.setProp("authEmail", "")
      store.setProp("status", "idle")
      store.setProp("error", undefined)
    },
  }))

export type AuthenticationStore = Instance<typeof AuthenticationStoreModel>

export type AuthenticationStoreSnapshot = SnapshotOut<typeof AuthenticationStoreModel>
