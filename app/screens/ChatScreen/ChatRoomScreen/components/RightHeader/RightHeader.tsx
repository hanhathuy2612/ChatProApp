import { Icon } from "app/components"
import { useCallService } from "app/hooks/useCallService"
import React from "react"
import { TouchableOpacity, View } from "react-native"
import { $styles } from "./RightHeader.styles"

type RightHeaderProps = {
  roomId: string
}

const RightHeader = (props: RightHeaderProps) => {
  const { roomId } = props
  const { joinRoom } = useCallService()

  const startCall = (roomId: string) => {
    console.log("Start call: ", roomId)
    joinRoom(roomId)
  }

  const handleCallPress = () => {
    console.log("Call press: ", roomId)
    startCall(roomId)
  }

  return (
    <View style={$styles.rightHeaderContainer}>
      <TouchableOpacity onPress={handleCallPress}>
        <Icon icon={"videoCall"} size={34} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default RightHeader
