import React from "react"
import { TouchableOpacity, View } from "react-native"
import { Icon } from "app/components"

type RightHeaderProps = {
  roomId: string
}

const RightHeader = (props: RightHeaderProps) => {
  const { roomId } = props
  const handleCallPress = () => {
    console.log("Call press: ", roomId)
  }

  return (
    <View style={{ paddingRight: 20 }}>
      <TouchableOpacity onPress={handleCallPress}>
        <Icon icon={"videoCall"} size={40}
              color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default RightHeader