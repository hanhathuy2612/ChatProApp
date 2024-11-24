import { Text } from "app/components"
import { useStores } from "app/models"
import { Room } from "app/models/ChatMessage"
import { AppUser } from "app/models/User"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { accountService } from "app/services/accountService"
import { roomService } from "app/services/roomService"
import { colors } from "app/theme"
import { imageRegistry } from "app/theme/images"
import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

export const ContactsScreen: FC<ChatBottomTabScreenProps<"Contacts">> = observer(
  function ContactsScreen(_props) {
    const { navigation } = _props
    const [contacts, setContacts] = useState<AppUser[]>([])
    const {
      authenticationStore: { authEmail },
    } = useStores()

    const navigateToPrivateChat = async (contact: AppUser): Promise<void> => {
      const emails = [contact.email ?? "", authEmail]

      const existingRoom = await roomService.getRoomByUsers(emails)
      if (existingRoom.status === 200 && existingRoom.data) {
        navigateToChatRoom(existingRoom.data, contact)
        return
      }

      const newRoom = await roomService.create({ appUsers: [contact] })
      if (newRoom.status === 200 && newRoom.data) {
        navigateToChatRoom(newRoom.data, contact)
      }
    }

    const navigateToChatRoom = (room: Room, contact: AppUser) => {
      navigation.navigate("ChatRoom", {
        roomId: room.id.toString(),
        title: `${contact.firstName} ${contact.lastName}`,
      })
    }

    useEffect(() => {
      accountService.getContacts().then((res) => {
        if (res.status === 200) {
          setContacts(res.data ?? [])
        }
      })
    }, [])

    return (
      <ChatScreenLayout>
        <View style={$contactListContainer}>
          {contacts.length > 0 &&
            contacts.map((item, index) => (
              <TouchableOpacity key={`${item}${index}`} onPress={() => navigateToPrivateChat(item)}>
                <View style={$contactItem}>
                  <Image source={imageRegistry.avatarMock} style={$contactImage} />
                  <View style={$contactDetails}>
                    <Text style={$contactName}>{`${item.firstName} ${item.lastName}`}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ChatScreenLayout>
    )
  },
)

const $contactListContainer: ViewStyle = {
  marginVertical: 10,
  gap: 10,
}

const $contactImage: ImageStyle = {
  resizeMode: "contain",
  width: 44,
  height: 44,
}

const $contactItem: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  gap: 15,
}

const $contactDetails: ViewStyle = {}

const $contactName: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 15,
}
