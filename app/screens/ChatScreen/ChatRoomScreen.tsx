import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { TextStyle, View, ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { RouteProp, useRoute } from "@react-navigation/native"
import { AppInput } from "app/screens/ChatScreen/AppInput"
import { ChatMessage } from "app/models/ChatMessage"
import useWebSocket from "app/hooks/useWebSocket"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ChatRoomScreenProps extends AppStackScreenProps<"ChatRoom"> {
}

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>()
  const { roomId } = route.params

  const {
    messages,
    sendMessage,
    isConnected,
  } = useWebSocket()

  useEffect(() => {
    if (isConnected) {
      sendMessage({
        content: "Hello Server!",
        type: "JOIN",
        room: {
          id: parseInt(roomId),
        },
      })
    }
  }, [isConnected])

  const handleSendPress = (message: string) => {
    const chatMessage: ChatMessage = {
      content: message,
      type: "CHAT",
      room: {
        id: parseInt(roomId),
      },
    }
    sendMessage(chatMessage)
  }

  return (
    <Screen contentContainerStyle={$rootContentContainer}
            style={$root}
            preset="scroll"
            safeAreaEdges={["top", "bottom"]}
    >
      <View style={$messageContainer}>
        {messages.map(message => (
          <View key={message.content} style={$messageItem}>
            <Text text={message.content} style={$messageItemText}/>
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
}

const $messageItem: ViewStyle = {
  backgroundColor: "#373E4E",
  alignSelf: "flex-start",
  alignItems: "center",
  justifyContent: "center",
  height: 40,
  borderRadius: 20,
  paddingHorizontal: 20
}

const $selfMessageItem: ViewStyle = {
}

const $messageItemText: TextStyle = {
  color: "white"
}

const $writeContainer: ViewStyle = {
  flexDirection: "row",
  gap: 15,
}
