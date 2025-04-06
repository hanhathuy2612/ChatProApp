import { CreateRoomRequest, Room } from "app/API/types/message.types"
import { ApiResponse } from "apisauce"
import { KIND, BaseApiResponse, BaseData, DefaultApiResponse, Pagination } from "app/API/types/common.types"
import { getGeneralApiProblem } from "app/API/apiProblem"
import { defaultApiSauce } from "../api"

interface RoomQuery {
  page: number
  size: number
}

class RoomService {
  getRoomByUsers(emails: string[]): Promise<ApiResponse<Room>> {
      return defaultApiSauce.post<Room>(`api/rooms/by-users`, emails)
  }

  getRecent(req?: RoomQuery): Promise<DefaultApiResponse<Pagination<Room>>> {
    return defaultApiSauce.get<BaseData<Pagination<Room>>>(`api/rooms/recent`, req)
  }

  async query(req?: RoomQuery): Promise<BaseApiResponse<Pagination<Room>>> {
    const response =
      await defaultApiSauce.get<BaseData<Pagination<Room>>>(`api/rooms`, req)

    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    try {
      const rawData: BaseData<Pagination<Room>> | undefined = response.data
      if (!rawData) {
        return { kind: KIND.BAD_DATA }
      }
      return { kind: KIND.OK, data: rawData.data }
    } catch (e) {
      if (__DEV__ && e instanceof Error) {
        console.error(`Bad data: ${e.message}\n${response.data}`, e.stack)
      }
      return { kind: KIND.BAD_DATA }
    }
  }

  create(room: CreateRoomRequest): Promise<ApiResponse<Room>> {
    return defaultApiSauce.post<Room>(`api/rooms`, room)
  }
}

export const roomService = new RoomService()
