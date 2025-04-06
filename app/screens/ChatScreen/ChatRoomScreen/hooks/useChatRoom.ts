import { useEffect, useState } from "react"
import { useStomp } from "app/contexts/StompContext"
import { useChatMessages } from "./useChatMessages"
import { useChatTyping } from "./useChatTyping"
import { Message } from "app/API"
import { Alert } from "react-native"

const useChatRoom = (
  accountId: string,
  roomId: string,
) => {
  const { sendMessage, subscribe, unsubscribe, connectionStatus, connectionError } = useStomp()
  const { messages, setMessages, flatListRef, fetchMessages, scrollToBottom } = useChatMessages(roomId)
  const { debouncedTyping } = useChatTyping(roomId, accountId, sendMessage)
  const [isConnected, setIsConnected] = useState(false)

  const handleNewMessage = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom()
  }

  useEffect(() => {
    let isMounted = true

    const fetchAndSubscribe = async () => {
      try {
        if (isMounted) {
          await fetchMessages()
          if (connectionStatus === "connected") {
            subscribe(`/chat/user/${accountId}`, handleNewMessage)
            setIsConnected(true)
          } else if (connectionStatus === "error") {
            setIsConnected(false)
            Alert.alert(
              "Error connecting",
              connectionError ?? "Cannot connect to chat server. Please try again later.",
            )
          }
        }
      } catch (error) {
        console.error("Error in fetchAndSubscribe:", error)
      }
    }

    fetchAndSubscribe()

    return () => {
      isMounted = false
      unsubscribe(`/chat/user/${accountId}`)
      unsubscribe(`/chat/user/${accountId}/typing`)
    }
  }, [roomId, connectionStatus])

  return {
    messages,
    flatListRef,
    setMessages,
    debouncedTyping,
    sendMessage,
    scrollToBottom,
    isConnected,
    connectionStatus,
    connectionError,
  }
}

export default useChatRoom