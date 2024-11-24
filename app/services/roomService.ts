import { Api } from "app/services/api";
import { NewRoom, Room } from './../models/ChatMessage';
import { ApiResponse } from "apisauce";
import { BaseResponse, DefaultApiResponse, PaginatedResponse } from "app/models/common";

interface RoomQuery {
  page: number
  size: number
} 

class RoomService extends Api {

  getRoomByUsers(emails: string[]): Promise<ApiResponse<Room>> {
    return this.apisauce.post<Room>(`api/rooms/by-users`, emails)
  }

  query(req?: RoomQuery): Promise<DefaultApiResponse<PaginatedResponse<Room>>> {
    return this.apisauce.get<BaseResponse<PaginatedResponse<Room>>>(`api/rooms`, req)
  }

  create(room: NewRoom): Promise<ApiResponse<Room>> {
    return this.apisauce.post<Room>(`api/rooms`, room)
  }
}

export const roomService = new RoomService()