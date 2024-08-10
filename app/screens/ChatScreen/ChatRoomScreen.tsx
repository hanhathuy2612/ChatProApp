import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
import { RouteProp, useRoute } from "@react-navigation/native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ChatRoomScreenProps extends AppStackScreenProps<"ChatRoom"> {}

export const ChatRoomScreen: FC<ChatRoomScreenProps> = observer(function ChatRoomScreen(_props) {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()

  const route = useRoute<RouteProp<AppStackParamList, "ChatRoom">>()
  const params = route.params
  console.log(params)
  return (
    <Screen style={$root} preset="scroll" safeAreaEdges={["top", "bottom"]}>
      <Text text="chatRoom" />
      <Text text={params.roomId} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
