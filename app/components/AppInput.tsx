import { Icon, IconTypes } from "app/components/index"
import { colors } from "app/theme"
import React, { useCallback, useRef, useState } from "react"
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { spacing } from "../theme"

export interface AppInputProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * Container style override.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for input.
   */
  inputStyle?: StyleProp<TextStyle>
  /**
   * Style overrides for input wrapper.
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * Background color of the input container.
   */
  backgroundColor?: string
  /**
   * Icon to display with input field.
   */
  icon?: IconTypes
  /**
   * Callback when the send button is pressed.
   */
  onSendPress?: (message: string) => void
  /**
   * Callback when typing.
   */
  onTyping?: (text: string) => void
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean
}

/**
 * A custom input component.
 */
export function AppInput(props: Readonly<AppInputProps>) {
  const {
    status,
    containerStyle: $containerStyleOverride,
    inputWrapperStyle: $inputWrapperStyleOverride,
    inputStyle: $inputStyleOverride,
    backgroundColor = colors.palette.neutral200,
    autoCapitalize = "none",
    autoComplete = "off",
    autoCorrect = false,
    multiline = false,
    icon,
    onSendPress,
    onTyping,
    disabled = false,
    ...TextInputProps
  } = props

  const input = useRef<TextInput>(null)
  const [text, setText] = useState("")

  const handleChangeText = useCallback(
    (value: string) => {
      if (disabled) return
      setText(value)
      if (onTyping) {
        onTyping(value)
      }
    },
    [onTyping, disabled],
  )

  const handleSendPress = useCallback(() => {
    if (disabled) return
    if (onSendPress && text !== "") {
      onSendPress(text)
      setText("")
    }
  }, [onSendPress, text, disabled])

  const $containerStyles = [$inputContainer, $containerStyleOverride]
  const $inputWrapperStyles = [$inputWrapper, $inputWrapperStyleOverride]
  const $inputStyles = [
    $input,
    status === "error" && { borderColor: colors.error },
    $inputStyleOverride,
    disabled && $disabledInput,
  ]

  return (
    <View style={$containerStyles}>
      <View
        style={[
          $inputWrapperStyles,
          { backgroundColor },
          status === "error" && { borderColor: colors.error },
          status === "disabled" && $disabledInputWrapper,
          disabled && $disabledInputWrapper,
        ]}
      >
        {!!icon && <Icon icon={icon} size={20} color={colors.palette.neutral800} />}
        <TextInput
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          {...TextInputProps}
          editable={!disabled && status !== "disabled"}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          autoCorrect={autoCorrect}
          multiline={multiline}
          style={$inputStyles}
          onChangeText={handleChangeText}
          value={text}
        />
        <TouchableOpacity onPress={handleSendPress} disabled={disabled || !text.trim()}>
          <Icon
            icon="dialog"
            size={24}
            color={text.trim() && !disabled ? colors.palette.neutral800 : colors.palette.neutral400}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $inputContainer: ViewStyle = {
  flexDirection: "column",
  width: "100%",
}

const $inputWrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderRadius: 10,
  backgroundColor: colors.palette.neutral200,
  borderColor: colors.palette.neutral400,
  paddingVertical: spacing.xs,
  paddingHorizontal: spacing.md,
  gap: spacing.sm,
}

const $disabledInputWrapper: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
  borderColor: colors.palette.neutral400,
  opacity: 0.6,
}

const $input: TextStyle = {
  flex: 1,
  alignSelf: "center",
  color: colors.text,
  fontSize: 16,
  height: 24,
  paddingVertical: 0,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
}

const $disabledInput: TextStyle = {
  color: colors.textDim,
}
