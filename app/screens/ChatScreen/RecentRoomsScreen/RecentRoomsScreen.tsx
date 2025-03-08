import { useFocusEffect } from "@react-navigation/native"
import { roomService } from "app/API/services/roomService"
import { KIND } from "app/API/types"
import { Message, Room } from "app/API/types/message.types"
import { useStomp } from "app/contexts/StompContext"
import { useStores } from "app/models"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useState } from "react"
import { View } from "react-native"
import { $styles } from "app/screens/ChatScreen/RecentRoomsScreen/recentRoom.styles"
import { RecentRoomItem } from "app/screens/ChatScreen/RecentRoomsScreen/components/RecentRoomItem/RecentRoomItem"

export type RecentRoomsScreenProps = ChatBottomTabScreenProps<"RecentRooms">

export const RecentRoomsScreen: FC<RecentRoomsScreenProps> = observer(function RecentRoomsScreen() {
  const {
    accountStore: { id: currentUserId },
  } = useStores()
  const [rooms, setRooms] = useState<Room[]>([])
  const { subscribe, unsubscribe } = useStomp()

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
      <View style={$styles.roomsListContainer}>
        {rooms.length > 0 &&
          rooms.map((room) => (
            <RecentRoomItem key={room.id} room={room} />
          ))}
      </View>
    </ChatScreenLayout>
  )
})


