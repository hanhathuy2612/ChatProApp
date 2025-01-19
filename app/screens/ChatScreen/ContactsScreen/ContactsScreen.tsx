import { roomService } from "app/API/services"
import { Room, User } from "app/API/types"
import { useStores } from "app/models"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"
import { observer } from "mobx-react-lite"
import React, { FC, useCallback, useMemo } from "react"
import { View } from "react-native"
import { ContactItem } from "./components/ContactItem/ContactItem"
import { useContacts } from "./hooks"
import { $styles } from "./styles"

export const ContactsScreen: FC<ChatBottomTabScreenProps<"Contacts">> = observer(
  function ContactsScreen({ navigation }) {
    const {
      authenticationStore: { authEmail },
    } = useStores()
    const { data: contacts = [] } = useContacts()

    const navigateToChatRoom = useCallback(
      (room: Room, contact: User) => {
        navigation.navigate("ChatRoom", {
          roomId: room.id.toString(),
          title: `${contact.firstName} ${contact.lastName}`,
        })
      },
      [navigation],
    )

    const handleContactPress = useCallback(
      async (contact: User) => {
        const emails = [contact.email ?? "", authEmail]

        try {
          const existingRoom = await roomService.getRoomByUsers(emails)
          if (existingRoom.status === 200 && existingRoom.data) {
            navigateToChatRoom(existingRoom.data, contact)
            return
          }

          const newRoom = await roomService.create({ appUsers: [contact] })
          if (newRoom.status === 200 && newRoom.data) {
            navigateToChatRoom(newRoom.data, contact)
          }
        } catch (error) {
          console.error("Error navigating to chat:", error)
        }
      },
      [authEmail, navigateToChatRoom],
    )

    const renderContacts = useMemo(
      () =>
        contacts.map((contact: User) => (
          <ContactItem key={contact.id} contact={contact} onPress={handleContactPress} />
        )),
      [contacts, handleContactPress],
    )

    return (
      <ChatScreenLayout>
        <View style={$styles.contactListContainer}>{renderContacts}</View>
      </ChatScreenLayout>
    )
  },
)
