import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { Text } from "app/components"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { AppUser } from "app/models/User"
import { accountService } from "app/services/accountService"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { imageRegistry } from "app/theme/images"
import { colors } from "app/theme"
import { roomService } from "app/services/roomService"
import { NewRoom } from "app/models/ChatMessage"

interface ContactsScreenProps extends ChatBottomTabScreenProps<"Contacts"> {
}

export const ContactsScreen: FC<ContactsScreenProps> = observer(function ContactsScreen(_props) {
  const { navigation } = _props
  const [contacts, setContacts] = useState<AppUser[]>([])

  const addToChatRoom = (item: AppUser) => {
    const newRoom: NewRoom = {
      appUsers: [item],
    }

    roomService.create(newRoom)
      .then(res => {
        if (res.status === 200) {
          const room = res.data
          if (room) {
            navigation.navigate("ChatRoom", { roomId: room.id.toString(), title: `${item.firstName} ${item.lastName}` })
          }
        }
      })
  }

  useEffect(() => {
    accountService.getContacts()
      .then(res => {
        if (res.status === 200) {
          setContacts(res.data ?? [])
        }
      })
  }, [])

  return (
    <ChatScreenLayout>
      <View style={$contactListContainer}>
        {contacts.length > 0 && contacts.map((item, index) => (
          <TouchableOpacity key={`${item}${index}`}
                            onPress={() => addToChatRoom(item)}
          >
            <View style={$contactItem}>
              <Image source={imageRegistry.avatarMock} style={$roomImage} />
              <View style={$roomDetails}>
                <Text style={$roomName}>{`${item.firstName} ${item.lastName}`}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ChatScreenLayout>
  )
})

const $contactListContainer: ViewStyle = {
  marginVertical: 10,
  gap: 10,
}

const $roomImage: ImageStyle = {
  resizeMode: "contain",
  width: 44,
  height: 44,
}

const $contactItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 15,
}

const $roomDetails: ViewStyle = {}


const $roomName: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 15,
}
