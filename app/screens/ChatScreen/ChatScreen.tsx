import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text } from "app/components"
import { imageRegistry } from "app/theme/images"
import { colors } from "app/theme"
import { AppInput } from "app/screens/ChatScreen/AppInput"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> {
}

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen(_props) {
  const { navigation } = _props
  const { avatarMock } = imageRegistry
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  const goChatRoom = (item: any): void => {
    navigation.navigate("ChatRoom", { roomId: item })
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <View style={$header}>
        <Image source={avatarMock} style={$avatar} />
        <Text text="Huy Ha" style={$headerText} />
      </View>

      <View style={$searchSection}>
        <AppInput />
        <Button style={$plusButton}
                textStyle={$plusText}
                text={"+"}
        ></Button>
      </View>

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
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  padding: 25,
  backgroundColor: colors.background,
  display: "flex",
  flexDirection: "column",
}

const $header: ViewStyle = {
  width: "100%",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: 15,
  paddingLeft: 10,
  paddingTop: 10,
  marginBottom: 10,
}

const $avatar: ImageStyle = {
  resizeMode: "contain",
  width: 45,
  height: 45,
}

const $headerText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 20,
}

const $searchSection: ViewStyle = {
  flexDirection: "row",
  gap: 10,
  marginVertical: 10,
}

const $plusButton: ViewStyle = {
  minHeight: 40,
  height: 40,
  width: 40,
  backgroundColor: "#03A9F1",
  borderWidth: 0,
  borderRadius: 10,
  justifyContent: "center",
  alignItems: "center",
}

const $plusText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 20,
}

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
