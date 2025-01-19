import { Api } from "app/API"
import { Message } from "app/API/types/message.types"
import { ApiResponse } from "apisauce"

interface ChatMessageQuery {
  roomId: number,
  page: number,
  size: number,
  sort: string
}

class ChatMessageService extends Api {
  query(req: ChatMessageQuery): Promise<ApiResponse<Message[]>> {
    return this.apisauce.get<Message[]>(`api/chat-messages/room/${req.roomId}`, req)
  }
}

export const chatMessageService = new ChatMessageService()
