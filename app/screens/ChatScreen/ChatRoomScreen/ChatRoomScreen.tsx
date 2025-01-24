import { RouteProp, useRoute } from "@react-navigation/native"
import { chatMessageService } from "app/API/services/chatMessageService"
import { Message } from "app/API/types/message.types"
import { Screen, Text } from "app/components"
import { AppInput } from "app/components/AppInput"
import { useStomp } from "app/contexts/StompContext"
import { useHeader } from "app/hooks/useHeader"
import { useStores } from "app/models"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import { FlatList, View } from "react-native"
import { v4 as uuidv4 } from "uuid"
import { $styles } from "./styles"

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
      onLeftPress: () => navigation.navigate("Chat", { screen: "RecentRooms" }),
    },
    [roomId],
  )
  const { sendMessage, subscribe, unsubscribe } = useStomp()
  const flatListRef = useRef<FlatList<Message>>(null)
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
        id: roomId,
      },
      sender: {
        id: accountId ?? undefined,
      },
    }

    sendMessage(chatMessage, `${destination}/messages`)
  }

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

  const handleLastMessage = (lastMessage: Message) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg.id === lastMessage.id)
      if (messageExists) {
        return prevMessages.map((msg) => (msg.id === lastMessage.id ? lastMessage : msg))
      }
      return [...prevMessages, lastMessage]
    })
  }

  const renderItem = useCallback(
    ({ item: message }: { item: Message }) => (
      <View style={[$styles.messageItem, message.sender?.id === accountId && $styles.selfMessage]}>
        <Text text={message.content} style={$styles.messageItemText} />
      </View>
    ),
    [accountId],
  )

  const keyExtractor = useCallback((item: Message) => item.id ?? "", [])

  useEffect(() => {
    fetchMessages().then(() => {
      subscribe(`/chat/user/${accountId}`, (message) => {
        handleLastMessage(message)
        scrollToBottom()
      })
    })

    return () => {
      unsubscribe(`/chat/user/${accountId}`)
    }
  }, [roomId])

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
        />
      </View>
    </Screen>
  )
})
