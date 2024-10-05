import React, { ComponentType, useMemo, useState } from "react"
import { TextField, TextFieldAccessoryProps, TextFieldProps } from "app/components/TextField"
import { Icon } from "app/components/Icon"
import { colors } from "app/theme"

function PasswordField(props: TextFieldProps) {
  const [isHidden, setIsHidden] = useState<boolean>(true)

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsHidden(!isHidden)}
          />
        )
      },
    [isHidden],
  )

  return (
    <TextField {...props} secureTextEntry={isHidden} RightAccessory={PasswordRightAccessory}/>
  )
}

export default PasswordField