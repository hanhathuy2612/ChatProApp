import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppStackParamList, AppStackScreenProps } from "app/navigators/AppNavigator"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { colors, spacing, typography } from "app/theme"
import { Icon, Text } from "app/components"
import React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { ChatRoomListScreen } from "app/screens/ChatScreen/ChatRoomListScreen"
import { ContactsScreen } from "app/screens"
import { observer } from "mobx-react-lite"

export type ChatBottomTabParamList = {
  ChatRooms: undefined
  Contacts: undefined
}

export type ChatBottomTabScreenProps<T extends keyof ChatBottomTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<ChatBottomTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<ChatBottomTabParamList>()

const ChatNavigator = observer(
  function ChatNavigator() {
    const { bottom } = useSafeAreaInsets()

    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: [$tabBar, { height: bottom + 70 }],
          tabBarActiveTintColor: colors.text,
          tabBarInactiveTintColor: colors.text,
          tabBarLabelStyle: $tabBarLabel,
          tabBarItemStyle: $tabBarItem,
        }}
        initialRouteName="ChatRooms"
      >
        <Tab.Screen
          name="ChatRooms"
          component={ChatRoomListScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[$tabBarLabel, { color: focused ? colors.tint : undefined }]}>Chat</Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Icon icon="dialog" color={focused ? colors.tint : undefined} size={30} />
            ),
          }}
        />

        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={[$tabBarLabel, { color: focused ? colors.tint : undefined }]}>Contacts</Text>
            ),
            tabBarIcon: ({ focused }) => (
              <Icon icon="podcast" color={focused ? colors.tint : undefined} size={30} />
            ),
          }}
        />
      </Tab.Navigator>
    )
  },
)

export default ChatNavigator

const $tabBar: ViewStyle = {
  backgroundColor: colors.background,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}