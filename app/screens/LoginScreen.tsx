import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { TextStyle, ToastAndroid, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { spacing } from "../theme"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { LoginRequest } from "app/services/accountService"
import PasswordField from "app/components/PasswordField"

type LoginForm = {
  username: string,
  password: string,
}

interface LoginScreenProps extends AppStackScreenProps<"Login"> {
}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const { navigation } = _props

  const {
    authenticationStore: { login },
  } = useStores()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: {
      username: "huy.ha@formos.com",
      password: "123456",
    },
  })

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const request: LoginRequest = {
      username: data.username,
      password: data.password,
    }

    await login(request)

    // navigation.navigate("Chat", {
    //   screen: "ChatRooms",
    // })
    ToastAndroid.show("Login successfully", ToastAndroid.SHORT)
  }

  function signup() {
    navigation.navigate("SignUp")
  }


  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx="loginScreen.signIn" preset="heading" style={$signIn} />
      <Text tx="loginScreen.enterDetails" preset="subheading" style={$enterDetails} />

      <Controller
        control={control}
        name="username"
        rules={{
          required: "This field is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            value={value}
            onChangeText={onChange}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            labelTx="loginScreen.emailFieldLabel"
            placeholderTx="loginScreen.emailFieldPlaceholder"
            helper={errors?.username ? errors?.username.message : undefined}
            status={errors?.username ? "error" : undefined}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{
          required: "This field is required",
        }}
        render={({ field: { onChange, value } }) => (
          <PasswordField
            value={value}
            onChangeText={onChange}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            labelTx="loginScreen.passwordFieldLabel"
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            helper={errors?.password ? errors?.password.message : undefined}
            status={errors?.password ? "error" : undefined}
          />
        )}
      />

      <Button
        testID="login-button"
        tx="loginScreen.tapToSignIn"
        style={$tapButton}
        preset="reversed"
        onPress={handleSubmit(onSubmit)}
      />

      <Button
        testID="register-button"
        text="Sign up"
        style={$tapButton}
        preset="filled"
        onPress={signup}
      />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
