import { useEffect, useState } from "react"
import { Keyboard, KeyboardEvent, Platform } from "react-native"

type KeyboardInfo = {
  keyboardHeight: number
  keyboardVisible: boolean
}

export function useKeyboard(): KeyboardInfo {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e: KeyboardEvent) => {
        setKeyboardVisible(true)
        setKeyboardHeight(e.endCoordinates.height)
      },
    )
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardVisible(false)
        setKeyboardHeight(0)
      },
    )

    // Cleanup
    return () => {
      keyboardWillShowListener.remove()
      keyboardWillHideListener.remove()
    }
  }, [])

  return {
    keyboardHeight,
    keyboardVisible,
  }
}
