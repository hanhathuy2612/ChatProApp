import { useFocusEffect } from "@react-navigation/native"
import { roomService } from "app/API/services/roomService"
import { appUserUtils, KIND, RoomMember, User } from "app/API/types"
import { Message, Room } from "app/API/types/message.types"
import { Text } from "app/components"
import { useStomp } from "app/contexts/StompContext"
import { useStores } from "app/models"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import * as React from "react"
import { FC, useCallback } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Avatar } from "react-native-paper"

type RecentRoomsScreenProps = ChatBottomTabScreenProps<"RecentRooms">
export const RecentRoomsScreen: FC<RecentRoomsScreenProps> = observer(function RecentRoomsScreen(
  _props,
) {
  const {
    accountStore: { id: currentUserId },
  } = useStores()
  const { navigation } = _props
  const [rooms, setRooms] = React.useState<Room[]>([])
  const { subscribe, unsubscribe } = useStomp()

  const getName = useCallback((room: Room) => {
    if (room.name) {
      return room.name
    }
    const friend: User | undefined = room.roomMembers?.findLast((roomMember: RoomMember) => roomMember.member.id !== currentUserId)
    return friend ? appUserUtils.getName(friend) : ""
  }, [])

  const goChatRoom = (item: Room): void => {
    navigation.navigate("ChatRoom", { roomId: item.id.toString(), title: getName(item) })
  }

  const fetchRecentRooms = async (): Promise<Room[]> => {
    const res = await roomService.query({ page: 0, size: 20 })
    if (KIND.OK === res.kind) {
      setRooms(res.data.content)
      return Promise.resolve(res.data.content)
    }
    return Promise.reject(new Error(res.kind))
  }

  const handleMessage = useCallback((message: Message) => {
    setRooms((currentRooms) => {
      return currentRooms.map((room) =>
        room.id === message.room.id ? { ...room, lastMessage: message } : room,
      )
    })
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchRecentRooms().then(() => {
        subscribe(`/chat/user/${currentUserId}`, handleMessage)
      })
      return () => {
        setRooms([])
        unsubscribe(`/chat/user/${currentUserId}`)
      }
    }, []),
  )

  return (
    <ChatScreenLayout>
      <View style={$roomsListContainer}>
        {rooms.length > 0 &&
          rooms.map((room) => (
            <TouchableOpacity key={room.id} onPress={() => goChatRoom(room)}>
              <View style={$roomListItem}>
                <Avatar.Text label={room.name ?? ""} size={40} />
                <View style={$roomDetails}>
                  <Text style={$roomName}>{getName(room)}</Text>
                  {room.lastMessage?.content && <Text style={$latestMessage}>{room.lastMessage?.content}</Text>}
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
