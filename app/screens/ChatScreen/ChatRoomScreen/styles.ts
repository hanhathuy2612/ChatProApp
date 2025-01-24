import { StyleSheet } from "react-native"

export const $styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 0,
  },
  rootContentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 25,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  messageScrollView: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "flex-end",
    gap: 10,
  },
  messageItem: {
    backgroundColor: "#373E4E",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
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
