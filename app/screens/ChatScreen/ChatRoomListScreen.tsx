import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Text } from "app/components"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors } from "app/theme"
import { imageRegistry } from "app/theme/images"
import { ChatScreenLayout } from "app/screens"

interface ChatRoomListScreenProps extends ChatBottomTabScreenProps<"ChatRooms"> {
}

export const ChatRoomListScreen: FC<ChatRoomListScreenProps> = observer(function ChatRoomListScreen(_props) {
  const { avatarMock } = imageRegistry
  const { navigation } = _props

  const goChatRoom = (item: any): void => {
    navigation.navigate("ChatRoom", { roomId: item })
  }

  return (
    <ChatScreenLayout>
      <View style={$roomsListContainer}>
        {Array(10).fill("").map((item, index) => (
          <TouchableOpacity key={`${item}${index}`}
                            onPress={() => goChatRoom(index)}
          >
            <View style={$roomListItem}>
              <Image source={avatarMock} style={$roomImage} />
              <View style={$roomDetails}>
                <Text style={$roomName}>Maciej Kowalski</Text>
                <Text style={$latestMessage}>Will do, super, thank you</Text>
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
