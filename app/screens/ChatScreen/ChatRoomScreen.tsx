import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AppInput } from "app/components/AppInput"
import { ChatMessage } from "app/models/ChatMessage"
import useWebSocket from "app/hooks/useWebSocket"
import { chatMessageService } from "app/services/chatMessageService"
import { useHeader } from "app/utils/useHeader"

interface ChatRoomScreenProps extends AppStackScreenProps<"ChatRoom"> {
}

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen(_props) {
  const { navigation } = _props
  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>()
  const { roomId, title } = route.params

  useHeader(
    {
      title: title ?? "ChatRoom",
      leftIcon: "back",
      onLeftPress: () => navigation.navigate("Chat", { screen: "ChatRooms" }),
    },
    [roomId],
  )

  const {
    lastMessage,
    sendMessage,
    isConnected,
  } = useWebSocket()

  const [messages, setMessages] = useState<ChatMessage[]>([])

  const handleSendPress = (message: string) => {
    if (!message) {
      return
    }
    const chatMessage: ChatMessage = {
      content: message.trim(),
      type: "CHAT",
      room: {
        id: parseInt(roomId),
      },
    }
    sendMessage(chatMessage)
  }

  const fetchMessages = () => {
    chatMessageService.query({ page: 0, size: 20, roomId })
      .then(
        res => {
          console.log("fetchMessages done: ", res.data)
          setMessages(res.data ?? [])
        },
      )
      .catch(error => {
        console.log("fetchMessages error: ", error)
      })
  }

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        content: "Hello Server!",
        type: "JOIN",
        room: {
          id: parseInt(roomId),
        },
      })

      fetchMessages()
    }
  }, [isConnected])

  useEffect(() => {
    if (!lastMessage) {
      return
    }

    if (!messages.some(message => message.id === lastMessage?.id)) {
      setMessages([...messages, lastMessage])
    }
  }, [lastMessage])

  return (
    <Screen contentContainerStyle={$rootContentContainer}
            style={$root}
            preset="scroll"
            safeAreaEdges={["top", "bottom"]}
    >
      <View style={$messageContainer}>
        {messages.map(message => (
          <View key={message.content} style={$messageItem}>
            <Text text={message.content} style={$messageItemText} />
          </View>
        ))}
      </View>

      <View style={$writeContainer}>
        <AppInput placeholder={"Write"}
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
  flex: 1,
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
