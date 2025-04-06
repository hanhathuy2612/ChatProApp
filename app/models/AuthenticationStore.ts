import { getRootStore } from "app/models/helpers/getRootStore"
import { withSetPropAction } from "app/models/helpers/withSetPropAction"
import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { KIND, LoginRequest } from "app/API/types"
import { authenticationService } from "app/API/services/authenticationService"
import { saveString, loadString, remove } from "app/utils/storage"
import { ACCESS_TOKEN, AUTH_EMAIL, REFRESH_TOKEN } from "app/constants/key-stored.constant"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    refreshToken: types.maybe(types.string),
    authEmail: "",
    status: types.optional(types.enumeration(["idle", "pending", "done", "error"]), "idle"),
    error: types.maybe(types.string),
    tokenRefreshInProgress: types.optional(types.boolean, false),
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
    setRefreshToken(value?: string) {
      store.refreshToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setTokenRefreshInProgress(value: boolean) {
      store.tokenRefreshInProgress = value
    },
    reset() {
      store.authToken = undefined
      store.refreshToken = undefined
      store.authEmail = ""
      store.status = "idle"
      store.error = undefined
    },
  }))
  .actions((store) => ({
    async login(request: LoginRequest) {
      try {
        store.setProp("status", "pending")
        store.setProp("error", undefined)

        const response = await authenticationService.login(request)
        console.log("response", response)
        if (response.kind === KIND.OK && response.data) {
          await this.handleLoginSuccess(response.data.accessToken, response.data.refreshToken, request.username)
          store.setProp("status", "done")
        } else {
          console.error(response)
          store.setProp("status", "error")
          store.setProp("error", "Login failed. Please try again.")
        }
      } catch (error) {
        console.log(error)
        store.setProp("status", "error")
        store.setProp("error", (error as Error).message)
        throw error
      }
    },

    async refreshAuthToken() {
      // Prevent multiple simultaneous refresh requests
      if (store.tokenRefreshInProgress) {
        return false
      }
      
      try {
        store.setTokenRefreshInProgress(true)
        const response = await authenticationService.refreshToken()
        
        if (response.kind === KIND.OK && response.data) {
          await this.handleTokenRefresh(response.data.accessToken, response.data.refreshToken)
          return true
        } else {
          console.error("Token refresh failed:", response)
          this.logout()
          return false
        }
      } catch (error) {
        console.error("Error refreshing token:", error)
        this.logout()
        return false
      } finally {
        store.setTokenRefreshInProgress(false)
      }
    },

    async handleLoginSuccess(token: string, refreshToken: string, email: string) {
      store.setProp("authToken", token)
      store.setProp("refreshToken", refreshToken)
      store.setProp("authEmail", email)

      await Promise.all([
        saveString(ACCESS_TOKEN, token), 
        saveString(REFRESH_TOKEN, refreshToken),
        saveString(AUTH_EMAIL, email)
      ])

      const rootStore = getRootStore(store)
      rootStore.accountStore.fetchAccount()
    },

    async handleTokenRefresh(token: string, refreshToken: string) {
      store.setProp("authToken", token)
      store.setProp("refreshToken", refreshToken)

      await Promise.all([
        saveString(ACCESS_TOKEN, token),
        saveString(REFRESH_TOKEN, refreshToken)
      ])

      return true
    },

    logout() {
      store.reset()
      // Clean up AsyncStorage
      Promise.all([
        remove(ACCESS_TOKEN),
        remove(REFRESH_TOKEN),
        remove(AUTH_EMAIL)
      ]).catch(e => console.error("Error clearing storage during logout:", e))
    },

    async restoreAuth() {
      try {
        const [token, refreshToken, email] = await Promise.all([
          loadString(ACCESS_TOKEN),
          loadString(REFRESH_TOKEN),
          loadString(AUTH_EMAIL)
        ])

        if (token && refreshToken) {
          store.setProp("authToken", token)
          store.setProp("refreshToken", refreshToken)
          store.setProp("authEmail", email || "")
          return true
        }
        return false
      } catch (error) {
        console.error("Error restoring authentication state:", error)
        return false
      }
    }
  }))

export type AuthenticationStore = Instance<typeof AuthenticationStoreModel>
export type AuthenticationStoreSnapshot = SnapshotOut<typeof AuthenticationStoreModel>
