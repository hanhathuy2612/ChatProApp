/**
 * This Api class lets you define an API endpoint and methods to request
 * data and process it.
 *
 * See the [Backend API Integration](https://docs.infinite.red/ignite-cli/boilerplate/app/services/#backend-api-integration)
 * documentation for more details.
 */
import { ApiResponse, ApisauceConfig, ApisauceInstance, create } from "apisauce"
import config from "../config"
import { EpisodeSnapshotIn } from "app/models/Episode"
import { GeneralApiProblem, getGeneralApiProblem } from "app/API/apiProblem"
import { ApiFeedResponse, KIND } from "app/API/types"
import { loadString } from "app/utils/storage"
import { ACCESS_TOKEN } from "app/constants/key-stored.constant"

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

const permitAllEndpoints = ["/api/authenticate/login"]
const isPermitAllEndpoint = (url: string) => permitAllEndpoints.includes(url)

export const defaultApiSauce = create(DEFAULT_API_CONFIG)

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

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApisauceConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApisauceConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = defaultApiSauce
  }

  /**
   * Gets a list of recent React Native Radio episodes.
   */
  async getEpisodes(): Promise<{ kind: "ok"; episodes: EpisodeSnapshotIn[] } | GeneralApiProblem> {
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
        rawData?.items.map((raw) => ({
          ...raw,
        })) ?? []

      return { kind: KIND.OK, episodes }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: KIND.BAD_DATA }
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()
