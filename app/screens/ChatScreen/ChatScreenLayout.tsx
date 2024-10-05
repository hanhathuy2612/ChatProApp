import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { Image, ImageStyle, TextStyle, TouchableOpacity, View, ViewProps, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text } from "app/components"
import { imageRegistry } from "app/theme/images"
import { colors } from "app/theme"
import { AppInput } from "app/components/AppInput"
import { useStores } from "app/models"

type ChatLayoutProps = ViewProps;

export const ChatScreenLayout: FC<ChatLayoutProps> = observer(function ChatScreen(_props) {
  const { children, ...props } = _props
  const { avatarMock } = imageRegistry
  const { authenticationStore } = useStores()

  const handleLogoutClick = () => {
    authenticationStore.logout()
  }

  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]} {...props}>
      <View style={$header}>
        <View style={$accountInfo}>
          <Image source={avatarMock} style={$avatar} />
          <Text text="Huy Ha" style={$headerText} />
        </View>

        <TouchableOpacity onPress={handleLogoutClick}>
          <Icon icon="bracketRight" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={$searchSection}>
        <AppInput />
        <Button style={$plusButton}
                textStyle={$plusText}
                text={"+"}
        ></Button>
      </View>

      {children}
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
  justifyContent: "space-between",
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

const $accountInfo: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
}
