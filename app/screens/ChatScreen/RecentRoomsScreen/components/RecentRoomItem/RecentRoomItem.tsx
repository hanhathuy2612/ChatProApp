import React, { FC, useCallback } from "react"
import { TouchableOpacity, View } from "react-native"
import { Avatar } from "react-native-paper"
import { Text } from "app/components"
import { appUserUtils, Room, RoomMember, User } from "app/API"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import { $styles } from "app/screens/ChatScreen/RecentRoomsScreen/components/RecentRoomItem/recentRoomItem.styles"
import { AppStackParamList } from "app/navigators"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"

type RecentRoomItemProps = {
  room: Room
}

export const RecentRoomItem: FC<RecentRoomItemProps> = (props) => {
  const { room } = props
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList, "ChatRoom">>()
  const {
    accountStore: { id: currentUserId },
  } = useStores()

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

  return (
    <TouchableOpacity onPress={() => goChatRoom(room)}>
      <View style={$styles.roomListItem}>
        <Avatar.Text label={room.name ?? ""} size={40} />
        <View style={$styles.contentWrapper}>
          <Text style={$styles.roomName} numberOfLines={1} ellipsizeMode="tail">{getName(room)}</Text>
          {room.lastMessage?.content && (
            <Text style={$styles.latestMessage} numberOfLines={2} ellipsizeMode="tail">
              {room.lastMessage?.content}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}