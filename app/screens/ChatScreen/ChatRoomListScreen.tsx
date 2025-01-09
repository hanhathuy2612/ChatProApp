import { useFocusEffect } from "@react-navigation/native"
import { Text } from "app/components"
import { useStomp } from "app/contexts/StompContext"
import { Room } from "app/models/ChatMessage"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { roomService } from "app/services/roomService"
import { colors } from "app/theme"
import { imageRegistry } from "app/theme/images"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useEffect } from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

type ChatRoomListScreenProps = ChatBottomTabScreenProps<"ChatRooms">

export const ChatRoomListScreen: FC<ChatRoomListScreenProps> = observer(function ChatRoomListScreen(
  _props,
) {
  const { avatarMock } = imageRegistry
  const { navigation } = _props
  const [rooms, setRooms] = React.useState<Room[]>([])
  const { subscribe } = useStomp()

  const goChatRoom = (item: Room): void => {
    navigation.navigate("ChatRoom", { roomId: item.id.toString(), title: item.name })
  }

  const fetchRecentRooms = () => {
    roomService.query({ page: 0, size: 20 }).then((res) => {
      setRooms(res.data?.data?.content ?? [])
    })
  }

  useEffect(() => {
    subscribe("/topic/rooms/updates", (message) => {
      console.log(message)
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchRecentRooms()
      return () => {
        setRooms([])
      }
    }, []),
  )

  return (
    <ChatScreenLayout>
      <View style={$roomsListContainer}>
        {rooms.length > 0 &&
          rooms.map((item, index) => (
            <TouchableOpacity key={`${item}${index}`} onPress={() => goChatRoom(item)}>
              <View style={$roomListItem}>
                <Image source={avatarMock} style={$roomImage} />
                <View style={$roomDetails}>
                  <Text style={$roomName}>{item.name}</Text>
                  <Text style={$latestMessage}>{item.lastMessage?.content}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ChatScreenLayout>
  )
})

const $roomsListContainer: ViewStyle = {
  marginVertical: 10,
  gap: 10,
}

const $roomListItem: ViewStyle = {
  flexDirection: "row",
  gap: 16,
  justifyContent: "flex-start",
  alignItems: "center",
}

const $roomImage: ImageStyle = {
  resizeMode: "contain",
  width: 44,
  height: 44,
}

const $roomDetails: ViewStyle = {}

const $roomName: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 15,
}

const $latestMessage: TextStyle = {
  color: colors.palette.neutral100,
  opacity: 0.6,
  fontSize: 13,
}
