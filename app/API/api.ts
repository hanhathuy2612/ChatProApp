/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApisauceConfig, create } from "apisauce"
import { ACCESS_TOKEN } from "app/constants/key-stored.constant"
import { _rootStore } from "app/models/helpers/useStores"
import { loadString } from "app/utils/storage"
import config from "../config"

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApisauceConfig = {
  baseURL: config.API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
  },
}

// A list of endpoints that don't require authentication
const permitAllEndpoints = new Set(["api/authenticate/login", "api/authenticate/refresh-token"])
const isPermitAllEndpoint = (url: string): boolean => 
  Array.from(permitAllEndpoints).some(endpoint => url.includes(endpoint))

/**
 * Manages all requests to the API.
 */
export const defaultApiSauce = create(DEFAULT_API_CONFIG)

// For token refresh handling
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null): void => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })
  
  failedQueue = []
}

// Add a request interceptor to add Authorization header
defaultApiSauce.axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await loadString(ACCESS_TOKEN)
    
    if (token && config.url && !isPermitAllEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Add a response interceptor to handle token refreshing
defaultApiSauce.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Prevent infinite loop for refresh token requests
    if (originalRequest.url?.includes("refresh-token") || originalRequest._retry) {
      return Promise.reject(new Error("Failed to refresh token"))
    }

    // Handle 401 errors - token expired
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // If a refresh is already in progress, add this request to the queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token as string}`
            return defaultApiSauce.axiosInstance(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Get the root store and attempt to refresh the token
        const rootStore = _rootStore
        const authStore = rootStore.authenticationStore
        const success = await authStore.refreshAuthToken()

        if (success) {
          const newToken = authStore.authToken
          processQueue(null, newToken)
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`
          return defaultApiSauce.axiosInstance(originalRequest)
        } else {
          const error = new Error("Failed to refresh token")
          processQueue(error)
          return Promise.reject(error)
        }
      } catch (refreshError) {
        const error = refreshError instanceof Error ? refreshError : new Error(String(refreshError))
        processQueue(error)
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)
