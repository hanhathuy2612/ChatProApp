import { ApiResponse } from "apisauce"
import { GeneralApiProblem } from "app/API/apiProblem"

export type BaseData<T> = {
  requestId: string
  timestamp: Date
  data: T
  errors: string[]
}

export type Pagination<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type DefaultApiResponse<T> = ApiResponse<BaseData<T>>

export type BaseApiResponse<T> = { kind: KIND, data: T } | GeneralApiProblem

export enum KIND {
  OK = "ok",
  BAD_DATA = "bad-data",
  ERROR = "error",
  SERVER = "server",
  UNKNOWN = "unknown",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not-found",
  REJECTED = "rejected",
  CANNOT_CONNECT = "cannot-connect",
  TIMEOUT = "timeout",
}

export enum Problem {
  CONNECTION_ERROR = "CONNECTION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  CLIENT_ERROR = "CLIENT_ERROR",
  CANCEL_ERROR = "CANCEL_ERROR",
}

