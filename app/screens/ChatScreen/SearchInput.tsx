import React from "react"
import { Icon, TextField, TextFieldAccessoryProps } from "app/components"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const SearchInput = () => {
  return (
    <TextField
      placeholder="Search..."
      RightAccessory={renderIcon}
      style={$searchInput}
      containerStyle={$searchContainer}
      inputWrapperStyle={$searchInputWrapper}
    />
  )
}

const radius = 8

const renderIcon = (props: TextFieldAccessoryProps) => {
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
      <Icon icon="lookup" containerStyle={[props.style, $icon]} size={18} />
    </View>
  )
}

const $searchContainer: ViewStyle = {
  borderRadius: radius,
  flex: 1
}

const $searchInput: TextStyle = {
  borderRadius: radius,
  fontSize: 14,
  color: "rgba(255,255,255,0.6)",
}

const $searchInputWrapper: ViewStyle = {
  backgroundColor: colors.primary025,
  borderRadius: radius,
  borderWidth: 0
}