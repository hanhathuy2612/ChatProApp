import { TextStyle, ViewStyle } from "react-native"
import { colors } from "app/theme"

export const $styles = {
  root: {
    flex: 1,
    paddingTop: 20,
  } as ViewStyle,

  rootContentContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    gap: 20,
  } as ViewStyle,

  messageFlatList: {
    width: "100%",
    flex: 1,
  } as ViewStyle,

  messageContainer: {
    gap: 10,
    padding: 20,
  } as ViewStyle,

  writeContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
  } as ViewStyle,

  messageItem: {
    backgroundColor: "#F3F4F9",
    borderRadius: 10,
    padding: 10,
    maxWidth: "80%",
    minWidth: 100,
    alignSelf: "flex-start",
  } as ViewStyle,

  messageItemText: {
    fontSize: 15,
    color: colors.palette.neutral800,
  } as TextStyle,

  selfMessage: {
    backgroundColor: "#03A9F1",
    alignSelf: "flex-end",
  } as ViewStyle,

  connectionIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: colors.palette.neutral200,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
    gap: 10,
  } as ViewStyle,

  connectionText: {
    fontSize: 14,
    color: colors.palette.neutral700,
  } as TextStyle,

  connectionError: {
    padding: 10,
    backgroundColor: colors.palette.angry500,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
  } as ViewStyle,

  errorText: {
    fontSize: 14,
    color: colors.palette.neutral100,
  } as TextStyle,
}
