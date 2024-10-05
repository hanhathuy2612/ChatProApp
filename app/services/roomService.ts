import { Api } from "app/services/api"
import { Room } from "app/models/ChatMessage"
import { ApiResponse } from "apisauce"
import { omit } from "lodash"

class RoomService extends Api {
  query(req?: any): Promise<ApiResponse<Room[]>> {
    return this.apisauce.get<Room[]>(`api/rooms`, req)
  }

  create(req?: any): Promise<ApiResponse<Room>> {
    return this.apisauce.post<Room>(`api/rooms`, req)
  }

  getMessagesInRoom(req: any) {
    return this.apisauce.get<Room[]>(`api/rooms/${req.roomId}/chat-messages`, omit(req, "roomId"))
  }
}

export const roomService = new RoomService()