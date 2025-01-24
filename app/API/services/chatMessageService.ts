import { ApiResponse } from "apisauce"
import { Api } from "app/API"
import { Message } from "app/API/types"

interface ChatMessageQuery {
  roomId: string
  page: number
  size: number
  sort: string
}

class ChatMessageService extends Api {
  query(req: ChatMessageQuery): Promise<ApiResponse<Message[]>> {
    return this.apisauce.get<Message[]>(`api/chat-messages/room/${req.roomId}`, req)
  }
}

export const chatMessageService = new ChatMessageService()
