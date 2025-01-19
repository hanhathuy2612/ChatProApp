import { ApiResponse } from "apisauce"
import { KIND, Problem } from "app/API/types"

export type GeneralApiProblem =
/**
 * Times up.
 */
  | { kind: KIND.TIMEOUT; temporary: true }
  /**
   * Cannot connect to the server for some reason.
   */
  | { kind: KIND.CANNOT_CONNECT; temporary: true }
  /**
   * The server experienced a problem. Any 5xx error.
   */
  | { kind: KIND.SERVER }
  /**
   * We're not allowed because we haven't identified ourself. This is 401.
   */
  | { kind: KIND.UNAUTHORIZED }
  /**
   * We don't have access to perform that request. This is 403.
   */
  | { kind: KIND.FORBIDDEN }
  /**
   * Unable to find that resource.  This is a 404.
   */
  | { kind: KIND.NOT_FOUND }
  /**
   * All other 4xx series errors.
   */
  | { kind: KIND.REJECTED }
  /**
   * Something truly unexpected happened. Most likely can try again. This is a catch all.
   */
  | { kind: KIND.UNKNOWN; temporary: true }
  /**
   * The data we received is not in the expected format.
   */
  | { kind: KIND.BAD_DATA }

/**
 * Attempts to get a common cause of problems from an api response.
 *
 * @param response The api response.
 */
export function getGeneralApiProblem(response: ApiResponse<never | null | object>): GeneralApiProblem | null {
  switch (response.problem) {
    case Problem.CONNECTION_ERROR:
      return { kind: KIND.CANNOT_CONNECT, temporary: true }
    case Problem.NETWORK_ERROR:
      return { kind: KIND.CANNOT_CONNECT, temporary: true }
    case Problem.TIMEOUT_ERROR:
      return { kind: KIND.TIMEOUT, temporary: true }
    case Problem.SERVER_ERROR:
      return { kind: KIND.SERVER }
    case Problem.UNKNOWN_ERROR:
      return { kind: KIND.UNKNOWN, temporary: true }
    case Problem.CLIENT_ERROR:
      switch (response.status) {
        case 401:
          return { kind: KIND.UNAUTHORIZED }
        case 403:
          return { kind: KIND.FORBIDDEN }
        case 404:
          return { kind: KIND.NOT_FOUND }
        default:
          return { kind: KIND.REJECTED }
      }
    case Problem.CANCEL_ERROR:
      return null
  }

  return null
}
