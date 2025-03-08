import { useEffect } from "react"
import { useStomp } from "app/contexts/StompContext"
import { useHeader } from "app/hooks/useHeader"
import { colors } from "app/theme"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { AppStackParamList } from "app/navigators"
import { useChatMessages } from "./useChatMessages"
import { useChatTyping } from "./useChatTyping"
import { useNavigation } from "@react-navigation/native"
import { Message } from "app/API"

const useChatRoom = (
  accountId: string,
  roomId: string,
  title?: string,
) => {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>()
  const { sendMessage, subscribe, unsubscribe } = useStomp()
  const { messages, setMessages, flatListRef, fetchMessages, scrollToBottom } = useChatMessages(roomId)
  const { debouncedTyping } = useChatTyping(roomId, accountId, sendMessage)

  const handleNewMessage = (newMessage: Message) => {
    console.log("old messages: ", messages)
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom()
  }

  useHeader({
    title: title ?? "ChatRoom",
    titleStyle: { color: colors.palette.neutral100 },
    leftIcon: "back",
    leftIconColor: colors.palette.neutral100,
    onLeftPress: () => navigation.navigate("Chat", { screen: "RecentRooms" }),
  }, [roomId])

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