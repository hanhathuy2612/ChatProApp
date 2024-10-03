import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Text } from "app/components"
import { ChatBottomTabScreenProps } from "app/navigators/ChatNavigator"
import { ChatScreenLayout } from "app/screens"

interface ContactsScreenProps extends ChatBottomTabScreenProps<"Contacts"> {
}

export const ContactsScreen: FC<ContactsScreenProps> = observer(function ContactsScreen() {
  return (
    <ChatScreenLayout>
      <Text text="contacts" />
    </ChatScreenLayout>
  )
})

