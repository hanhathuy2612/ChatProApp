import { ApiResponse } from "apisauce"

export type BaseResponse<T> = {
  requestId: string
  timestamp: Date
  data: T
  errors: string[]
}

export type PaginatedResponse<T> = {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type DefaultApiResponse<T> = ApiResponse<BaseResponse<T>>

