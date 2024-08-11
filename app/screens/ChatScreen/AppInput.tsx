import React from "react"
import { Icon, TextField, TextFieldAccessoryProps } from "app/components"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors } from "app/theme"

export type AppInputProps = {
  placeholder?: string,
  icon?: string,
  multiline?: boolean
}

export const AppInput = ({
                           placeholder = "Search...",
                           icon = "lookup",
                           multiline = false
                         }: AppInputProps) => {
  return (
    <TextField
      placeholder={placeholder}
      RightAccessory={(props) => renderIcon(props, icon)}
      style={$searchInput}
      containerStyle={$searchContainer}
      inputWrapperStyle={$searchInputWrapper}
      multiline={multiline}
      numberOfLines={1}
    />
  )
}

const radius = 8

const renderIcon = (props: TextFieldAccessoryProps, icon: any) => {
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
      <Icon icon={icon} containerStyle={[props.style, $icon]} size={18} />
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
  minHeight: "auto"
}