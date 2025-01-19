import { RouteProp, useRoute } from "@react-navigation/native"
import { chatMessageService } from "app/API/services/chatMessageService"
import { Message } from "app/API/types/message.types"
import { Icon, Screen, Text } from "app/components"
import { AppInput } from "app/components/AppInput"
import { useStomp } from "app/contexts/StompContext"
import { useHeader } from "app/hooks/useHeader"
import { useStores } from "app/models"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { ScrollView, TextStyle, View, ViewStyle } from "react-native"
import { v4 as uuidv4 } from "uuid"

type ChatRoomScreenProps = AppStackScreenProps<"ChatRoom">

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen(_props) {
  const { navigation } = _props
  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>()
  const { roomId, title } = route.params
  const {
    accountStore: { id: accountId },
  } = useStores()
  const destination = `/chat/room/${roomId}`
  useHeader(
    {
      title: title ?? "ChatRoom",
      leftIcon: "back",
      onLeftPress: () => navigation.navigate("Chat", { screen: "ChatRooms" }),
    },
    [roomId],
  )
  const { sendMessage, subscribe, unsubscribe } = useStomp()
  const scrollViewRef = useRef<ScrollView>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendPress = (message: string) => {
    if (!message) {
      return
    }

    const chatMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      type: "CHAT",
      room: {
        id: parseInt(roomId),
      },
      sender: {
        id: accountId ?? undefined,
      },
    }

    sendMessage(chatMessage, `${destination}/send`)
  }

  const fetchMessages = async () => {
    const res = await chatMessageService.query({
      page: 0,
      size: 20,
      sort: "createdDate,desc",
      roomId: parseInt(roomId),
    })
    if (res.status === 200) {
      setMessages(res.data?.reverse() ?? [])
      scrollToEnd()
    }
  }

  const scrollToEnd = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    })
  }

  const handleLastMessage = (lastMessage: Message) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg.id === lastMessage.id)
      if (messageExists) {
        return prevMessages.map((msg) => (msg.id === lastMessage.id ? lastMessage : msg))
      }
      return [...prevMessages, lastMessage]
    })
  }

  useEffect(() => {
    fetchMessages().then(() => {
      subscribe(`/chat/room/${roomId}`, (message) => {
        handleLastMessage(message)
        scrollToEnd()
      })
    })

    return () => {
      unsubscribe(`/chat/room/${roomId}`)
    }
  }, [roomId])

  return (
    <Screen
      contentContainerStyle={$rootContentContainer}
      style={$root}
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
    >
      <ScrollView ref={scrollViewRef} style={{ flex: 1 }} contentContainerStyle={$messageContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[$messageItem, message.sender?.id === accountId && $selfMessage]}
          >
            <Text text={message.content} style={$messageItemText} />
          </View>
        ))}
      </ScrollView>

      <View style={$writeContainer}>
        <AppInput
          placeholder={"Write"}
          icon={"dialog"}
          multiline={true}
          onSendPress={handleSendPress}
        />
        <Icon icon={"dialog"} size={40} />
      </View>
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $rootContentContainer: ViewStyle = {
  flex: 1,
  paddingHorizontal: 25,
  paddingVertical: 52,
  gap: 25,
}

const $messageContainer: ViewStyle = {
  flexBasis: "auto",
  justifyContent: "flex-end",
  gap: 10,
}

const $messageItem: ViewStyle = {
  backgroundColor: "#373E4E",
  alignSelf: "flex-start",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: 20,
  paddingHorizontal: 20,
}

const $messageItemText: TextStyle = {
  color: "white",
}

const $writeContainer: ViewStyle = {
  flexDirection: "row",
  gap: 15,
}

const $selfMessage: ViewStyle = {
  alignSelf: "flex-end",
}
