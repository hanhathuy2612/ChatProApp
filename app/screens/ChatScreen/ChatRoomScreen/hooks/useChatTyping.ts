import { useCallback } from "react"
import { debounce } from "lodash"
import { v4 as uuidv4 } from "uuid"
import { ChatType, Message } from "app/API"

export const useChatTyping = (roomId: string, accountId: string, sendMessage: (msg: Message, destination: string) => void) => {
  const destination = `/chat/room/${roomId}/typing`

  const debouncedTyping = useCallback(
    debounce((text: string) => {
      const message: Message = {
        id: uuidv4(),
        content: text,
        type: ChatType.TYPING,
        room: { id: roomId },
        sender: { id: accountId },
      }
      sendMessage(message, destination)
    }, 500),
    [roomId, accountId],
  )

  return { debouncedTyping }
}