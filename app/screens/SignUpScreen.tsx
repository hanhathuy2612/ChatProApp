import React, { FC } from "react"
import { observer } from "mobx-react-lite"
// eslint-disable-next-line react-native/split-platform-components
import { TextStyle, ToastAndroid, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Screen, Text, TextField } from "app/components"
import { spacing } from "app/theme"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { accountService, SignupRequest } from "app/services/accountService"
import PasswordField from "app/components/PasswordField"


interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {
}

type SignUpForm = {
  username: string,
  password: string,
  rePassword: string
  firstName: string,
  lastName: string,
}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const { navigation } = _props
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      username: "huy.ha@formos.com",
      password: "123456",
      rePassword: "123456",
      firstName: "huy",
      lastName: "ha",
    },
  })

  const onSubmit: SubmitHandler<SignUpForm> = (data) => {
    const request: SignupRequest = {
      username: data.username,
      login: data.username,
      email: data.username,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    }

    accountService.signup(request).then(res => {
      if (res.status === 200) {
        navigation.navigate("Login")
      } else {
        ToastAndroid.show("Login Fail", ToastAndroid.SHORT)
      }
    })
  }

  return (
    <Screen
      style={$root}
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$screenContentContainer}
    >
      <Text text="Sign Up" preset="heading" size={"lg"} style={$signupTitle} />

      <Controller
        name="username"
        control={control}
        rules={{
          required: "Enter your email address",
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChangeText={onChange}
            value={value}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            labelTx="signupScreen.emailFieldLabel"
            placeholderTx="signupScreen.emailFieldPlaceholder"
            helper={errors?.username ? errors?.username.message : undefined}
            status={errors?.username ? "error" : undefined}
            {...register("username")}
          />
        )}
      />

      <Controller
        name="firstName"
        control={control}
        rules={{
          required: "First name is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChangeText={onChange}
            value={value}
            containerStyle={$textField}
            autoCapitalize="none"
            autoCorrect={false}
            labelTx="signupScreen.firstNameFieldLabel"
            placeholderTx="signupScreen.firstNameFieldPlaceholder"
            helper={errors?.firstName ? errors?.firstName?.message : undefined}
            status={errors?.firstName ? "error" : undefined}
            {...register("firstName")}
          />
        )}
      />

      <Controller
        name="lastName"
        control={control}
        rules={{
          required: "Last name is required",
        }}
        render={({ field: { onChange, value } }) => (
          <TextField
            onChangeText={onChange}
            value={value}
            containerStyle={$textField}
            autoCapitalize="none"
            autoCorrect={false}
            labelTx="signupScreen.lastNameFieldLabel"
            placeholderTx="signupScreen.lastNameFieldPlaceholder"
            helper={errors?.lastName ? errors?.lastName?.message : undefined}
            status={errors?.lastName ? "error" : undefined}
            {...register("lastName")}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: "Password is required",
        }}
        render={({ field: { onChange, value } }) => (
          <PasswordField
            onChangeText={onChange}
            value={value}
            containerStyle={$textField}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            labelTx="signupScreen.passwordFieldLabel"
            placeholderTx="signupScreen.passwordFieldPlaceholder"
            helper={errors?.password ? errors?.password?.message : undefined}
            status={errors?.password ? "error" : undefined}
            {...register("password")}
          />
        )}
      />

      <Controller
        name="rePassword"
        control={control}
        rules={{
          validate: {
            passwordMatch: (value, formValues) => value === formValues.password ? true : "Repeat password is not matching",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <PasswordField
            onChangeText={onChange}
            value={value}
            containerStyle={$textField}
            autoCorrect={false}
            autoCapitalize="none"
            labelTx="signupScreen.rePasswordFieldLabel"
            placeholderTx="signupScreen.rePasswordFieldPlaceholder"
            helper={errors?.rePassword ? errors?.rePassword?.message : undefined}
            status={errors?.rePassword ? "error" : undefined}
            {...register("rePassword")}
          />
        )}
      />

      <Button
        text="Submit"
        onPress={handleSubmit(onSubmit)}
        preset="reversed"
      />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $signupTitle: TextStyle = {
  textAlign: "center",
  marginBottom: spacing.lg,
}
