import React from "react"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "app/components"
import { $styles } from "./rightHeader.styles"

type RightHeaderProps = {
  roomId: string
}

const RightHeader = (props: RightHeaderProps) => {
  const { roomId } = props

  const startCall = (roomId: string) => {

  }

  const handleCallPress = () => {
    console.log("Call press: ", roomId)
    startCall(roomId)
  }

  return (
    <View style={$styles.rightHeaderContainer}>
      <TouchableOpacity onPress={handleCallPress}>
        <Icon icon={"videoCall"} size={34}
              color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default RightHeader