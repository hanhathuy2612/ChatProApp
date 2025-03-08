import { useEffect } from "react"
import { useStomp } from "app/contexts/StompContext"
import { useChatMessages } from "./useChatMessages"
import { useChatTyping } from "./useChatTyping"
import { Message } from "app/API"

const useChatRoom = (
  accountId: string,
  roomId: string,
) => {
  const { sendMessage, subscribe, unsubscribe } = useStomp()
  const { messages, setMessages, flatListRef, fetchMessages, scrollToBottom } = useChatMessages(roomId)
  const { debouncedTyping } = useChatTyping(roomId, accountId, sendMessage)

  const handleNewMessage = (newMessage: Message) => {
    console.log("old messages: ", messages)
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom()
  }

  useEffect(() => {
    fetchMessages().then(() => {
      subscribe(`/chat/user/${accountId}`, handleNewMessage)
    })
    return () => {
      unsubscribe(`/chat/user/${accountId}`)
      unsubscribe(`/chat/user/${accountId}/typing`)
    }
  }, [roomId])

  return {
    messages,
    flatListRef,
    setMessages,
    debouncedTyping,
    sendMessage,
    scrollToBottom,
  }
}

export default useChatRoom