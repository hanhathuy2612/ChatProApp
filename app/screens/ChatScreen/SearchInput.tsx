import React from "react"
import { Icon, TextField, TextFieldAccessoryProps } from "app/components"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const SearchInput = () => {

  const renderIcon = (props: TextFieldAccessoryProps) => {
    const $iconContainer: ViewStyle = {
      width: 40,
      height: 40,
      display: "flex",
      backgroundColor: "#565E70",
      justifyContent: "center",
      alignItems: "center",
    }
    return <View style={$iconContainer}>
      <Icon icon="lookup" containerStyle={props.style} size={18} />
    </View>
  }

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

const $searchContainer: ViewStyle = {
  backgroundColor: colors.primary025,
  borderRadius: 10,
}

const $searchInput: TextStyle = {
  backgroundColor: colors.primary025,
}

const $searchInputWrapper: ViewStyle = {
  backgroundColor: colors.primary025,
}