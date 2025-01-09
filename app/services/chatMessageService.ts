import { Api } from "app/services/api"
import { ChatMessage } from "app/models/ChatMessage"
import { ApiResponse } from "apisauce"

interface ChatMessageQuery {
  roomId: number,
  page: number,
  size: number
}

class ChatMessageService extends Api {
  query(req: ChatMessageQuery): Promise<ApiResponse<ChatMessage[]>> {
    return this.apisauce.get<ChatMessage[]>(`api/chat-messages/room/${req.roomId}`, req)
  }
}

export const chatMessageService = new ChatMessageService()
