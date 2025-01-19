import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  } as ViewStyle,
  
  image: {
    resizeMode: "contain",
    width: 44,
    height: 44,
  } as ImageStyle,
  
  details: {} as ViewStyle,
  
  name: {
    color: colors.palette.neutral100,
    fontSize: 15,
  } as TextStyle,
})