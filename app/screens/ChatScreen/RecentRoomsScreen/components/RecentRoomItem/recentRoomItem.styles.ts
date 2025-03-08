import { StyleSheet } from "react-native"
import { colors } from "app/theme"

export const $styles = StyleSheet.create({
  roomListItem: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  roomName: {
    color: colors.palette.neutral100,
    fontSize: 15,
  },
  latestMessage: {
    color: colors.palette.neutral100,
    opacity: 0.6,
    fontSize: 13,
    lineHeight: 22,
    flex: 1,
  },
  contentWrapper: { flex: 1 },
})