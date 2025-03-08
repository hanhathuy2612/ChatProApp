import { RouteProp, useRoute } from "@react-navigation/native"
import { Message } from "app/API/types/message.types"
import { Screen, Text } from "app/components"
import { AppInput } from "app/components/AppInput"
import { useStores } from "app/models"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback } from "react"
import { FlatList, View } from "react-native"
import { v4 as uuidv4 } from "uuid"
import { $styles } from "./chatRoom.styles"
import useChatRoom from "app/screens/ChatScreen/ChatRoomScreen/hooks/useChatRoom"

export type ChatRoomScreenProps = AppStackScreenProps<"ChatRoom">

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen() {
  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>()
  const { roomId, title } = route.params
  const {
    accountStore: { id: accountId },
  } = useStores()

  if (!accountId) {
    throw new Error("AccountId is required")
  }

  const {
    flatListRef,
    messages,
    sendMessage,
    scrollToBottom,
    debouncedTyping,
  } = useChatRoom(accountId, roomId, title)

  const destination = `/chat/room/${roomId}`

  const renderItem = useCallback(
    ({ item: message }: { item: Message }) => (
      <View style={[$styles.messageItem, message.sender?.id === accountId && $styles.selfMessage]}>
        <Text text={message.content} style={$styles.messageItemText} />
      </View>
    ),
    [accountId],
  )

  const keyExtractor = useCallback((item: Message) => item.id ?? "", [])

  const handleSendPress = (message: string) => {
    if (!message) {
      return
    }

    const chatMessage: Message = {
      id: uuidv4(),
      content: message.trim(),
      type: "CHAT",
      room: {
        id: roomId,
      },
      sender: {
        id: accountId ?? undefined,
      },
    }

    sendMessage(chatMessage, `${destination}/messages`)
  }

  const handleTyping = (text: string) => {
    debouncedTyping(text)
  }

  return (
    <Screen
      style={$styles.root}
      contentContainerStyle={$styles.rootContentContainer}
      preset="fixed"
      keyboardOffset={85}
    >
      <FlatList
        ref={flatListRef}
        style={$styles.messageFlatList}
        contentContainerStyle={$styles.messageContainer}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        inverted={false}
        onContentSizeChange={scrollToBottom}
        onLayout={scrollToBottom}
        showsVerticalScrollIndicator={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />

      <View style={$styles.writeContainer}>
        <AppInput
          placeholder={"Write"}
          icon={"dialog"}
          multiline={true}
          onSendPress={handleSendPress}
          onTyping={handleTyping}
        />
      </View>
    </Screen>
  )
})
