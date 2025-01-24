import { StyleSheet } from "react-native"

export const $styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 0,
  },
  rootContentContainer: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flex: 1,
    gap: 10,
  },
  messageFlatList: {
    flex: 1,
  },
  messageContainer: {
    justifyContent: "flex-end",
    gap: 10,
    paddingHorizontal: 10,
  },
  messageItem: {
    backgroundColor: "#373E4E",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  messageItemText: {
    color: "white",
  },
  writeContainer: {
    flexDirection: "row",
    gap: 15,
  },
  selfMessage: {
    alignSelf: "flex-end",
  },
})
