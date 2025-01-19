import { Api } from "app/API"
import { NewRoom, Room } from "app/API/types/message.types"
import { ApiResponse } from "apisauce"
import { KIND, BaseApiResponse, BaseData, DefaultApiResponse, Pagination } from "app/API/types/common.types"
import { getGeneralApiProblem } from "app/API/apiProblem"

interface RoomQuery {
  page: number
  size: number
}

class RoomService extends Api {
  getRoomByUsers(emails: string[]): Promise<ApiResponse<Room>> {
    return this.apisauce.post<Room>(`api/rooms/by-users`, emails)
  }

  getRecent(req?: RoomQuery): Promise<DefaultApiResponse<Pagination<Room>>> {
    return this.apisauce.get<BaseData<Pagination<Room>>>(`api/rooms/recent`, req)
  }

  async query(req?: RoomQuery): Promise<BaseApiResponse<Pagination<Room>>> {
    const response =
      await this.apisauce.get<BaseData<Pagination<Room>>>(`api/rooms`, req)

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

  create(room: NewRoom): Promise<ApiResponse<Room>> {
    return this.apisauce.post<Room>(`api/rooms`, room)
  }
}

export const roomService = new RoomService()
