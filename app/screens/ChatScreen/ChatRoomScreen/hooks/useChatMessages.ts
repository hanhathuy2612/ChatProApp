import { useRef, useState } from "react"
import { FlatList } from "react-native"
import { chatMessageService, Message } from "app/API"

export const useChatMessages = (roomId: string) => {
  const [messages, setMessages] = useState<Message[]>([])
  const flatListRef = useRef<FlatList<Message>>(null)

  const fetchMessages = async () => {
    const res = await chatMessageService.query({
      page: 0,
      size: 20,
      sort: "createdDate,desc",
      roomId,
    })
    if (res.status === 200) {
      setMessages(res.data?.reverse() ?? [])
      scrollToBottom()
    }
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true })
    })
  }

  return { messages, setMessages, flatListRef, fetchMessages, scrollToBottom }
}