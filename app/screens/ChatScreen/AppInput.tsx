import React from "react"
import { Icon, TextField, TextFieldAccessoryProps } from "app/components"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { colors } from "app/theme"

export type AppInputProps = {
  placeholder?: string,
  icon?: string,
  multiline?: boolean,
  onSendPress?: (text: string) => void,
}

export const AppInput = ({
                           placeholder = "Search...",
                           icon = "lookup",
                           multiline = false,
                           onSendPress,
                         }: AppInputProps) => {

  const [text, setText] = React.useState<string>("")

  const handleSendPress = () => {
    onSendPress?.(text);
    setText('')
  }

  return (
    <TextField
      placeholder={placeholder}
      RightAccessory={(props) => renderIcon(props, icon, handleSendPress)}
      style={$searchInput}
      containerStyle={$searchContainer}
      inputWrapperStyle={$searchInputWrapper}
      multiline={multiline}
      numberOfLines={1}
      onChangeText={setText}
      value={text}
    />
  )
}

const radius = 8

const renderIcon = (props: TextFieldAccessoryProps, icon: any, onSendPress: () => void) => {
  const $iconContainer: ViewStyle = {
    width: 40,
    height: 40,
    backgroundColor: "#565E70",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 40,
    flexDirection: "row",
    borderRadius: radius,
  }

  const $icon: ViewStyle = {
    marginEnd: 0,
  }

  return (
    <View style={$iconContainer}>
      <TouchableOpacity onPress={() => onSendPress()}>
        <Icon icon={icon}
              containerStyle={[props.style, $icon]}
              size={18}
        />
      </TouchableOpacity>
    </View>
  )
}

const $searchContainer: ViewStyle = {
  borderRadius: radius,
  flex: 1,
}

const $searchInput: TextStyle = {
  borderRadius: radius,
  fontSize: 14,
  color: "rgba(255,255,255,0.6)",
}

const $searchInputWrapper: ViewStyle = {
  backgroundColor: colors.primary025,
  borderRadius: radius,
  borderWidth: 0,
  minHeight: "auto",
}