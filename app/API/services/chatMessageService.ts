import { ApiResponse } from "apisauce"
import { Message } from "app/API/types"
import { defaultApiSauce } from "../api"

interface ChatMessageQuery {
  roomId: string
  page: number
  size: number
  sort: string
}

class ChatMessageService {
  query(req: ChatMessageQuery): Promise<ApiResponse<Message[]>> {
    return defaultApiSauce.get<Message[]>(`api/chat-messages/room/${req.roomId}`, req)
  }
}

export const chatMessageService = new ChatMessageService()
