/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceConfig, ApisauceInstance, create } from "apisauce"
import { getGeneralApiProblem } from "app/API/apiProblem"
import { ApiFeedResponse } from "app/API/types"
import { ACCESS_TOKEN } from "app/constants/key-stored.constant"
import { EpisodeSnapshotIn } from "app/models/Episode"
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
const permitAllEndpoints = ["api/authenticate/login", "api/authenticate/refresh-token"]
const isPermitAllEndpoint = (url: string) =>
  permitAllEndpoints.some((endpoint) => url.includes(endpoint))

/**
 * Manages all requests to the API.
 */
export const defaultApiSauce = create(DEFAULT_API_CONFIG)

// Add a request interceptor to add Authorization header
defaultApiSauce.axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await loadString(ACCESS_TOKEN)
    if (token && !isPermitAllEndpoint(config.url!)) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(new Error(error))
  },
)

// Add a response interceptor to handle token refreshing
let isRefreshing = false
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void }[] = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve(token)
    }
  })

  failedQueue = []
}

defaultApiSauce.axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Prevent infinite loop for refresh token requests
    if (originalRequest.url.includes("refresh-token") || originalRequest._retry) {
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
            originalRequest.headers["Authorization"] = `Bearer ${token}`
            return defaultApiSauce.axiosInstance(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(new Error(err))
          })
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
          processQueue(new Error("Failed to refresh token"))
          return Promise.reject(new Error("Failed to refresh token"))
        }
      } catch (refreshError) {
        processQueue(refreshError as Error)
        return Promise.reject(new Error(refreshError as string))
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(new Error(error))
  },
)

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApisauceConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApisauceConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create(config)
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: string; episodes?: EpisodeSnapshotIn[] }> {
    // make the api call
    const response: ApiResponse<ApiFeedResponse> = await this.apisauce.get(
      `api.json?rss_url=https%3A%2F%2Ffeeds.simplecast.com%2FhEI_f9Dx`,
    )

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const rawData = response.data

      // This is where we transform the data into the shape we expect for our MST model.
      const episodes: EpisodeSnapshotIn[] =
        rawData?.items?.map((raw) => ({
          ...raw,
        })) || []

      return { kind: "ok", episodes }
    } catch (e: unknown) {
      if (__DEV__ && e instanceof Error) {
        console.tron.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: "bad-data" }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
