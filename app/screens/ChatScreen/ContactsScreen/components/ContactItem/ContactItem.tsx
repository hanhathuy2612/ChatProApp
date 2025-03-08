import { User } from "app/API/types"
import { imageRegistry } from "app/theme/images"
import React, { FC } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"
import { $styles } from "./contactItem.styles"

export const ContactItem: FC<{
  contact: User
  onPress: (contact: User) => void
}> = ({ contact, onPress }) => (
  <TouchableOpacity onPress={() => onPress(contact)}>
    <View style={$styles.container}>
      <Image source={imageRegistry.avatarMock} style={$styles.image} />
      <View style={$styles.details}>
        <Text style={$styles.name}>{`${contact.firstName} ${contact.lastName}`}</Text>
      </View>
    </View>
  </TouchableOpacity>
)
