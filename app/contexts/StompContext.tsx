import { Client, IMessage, messageCallbackType, StompHeaders } from "@stomp/stompjs"
import { Message } from "app/API/types/message.types"
import config from "app/config"
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { useStores } from "app/models"
import { CallMessage } from "app/API/types/call.types"
import { Alert } from "react-native"

type CallbackMessage = (message: Message) => void

type StompContextType = {
  sendMessage: (message: Message, destination: string) => void
  sendCallMessage: (message: CallMessage, destination: string) => void
  subscribe: (url: string, callback: CallbackMessage) => void
  unsubscribe: (url: string) => void
  connectionStatus: ConnectionStatus
  connectionError?: string
}

export enum ConnectionStatus {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

const StompContext = createContext<StompContextType | null>(null)

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null)
  const subscriptions = useRef<Map<string, string>>(new Map())
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED,
  )
  const [connectionError, setConnectionError] = useState<string | undefined>(undefined)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { authenticationStore } = useStores()

  const token = authenticationStore.authToken

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No access token found. WebSocket will not connect.")
      setConnectionStatus(ConnectionStatus.DISCONNECTED)
      return
    }

    if (clientRef.current) {
      setConnectionStatus(ConnectionStatus.CONNECTING)
      clientRef.current.deactivate().then(() => {
        console.log("🔌 WebSocket disconnected before reconnecting.")
        initializeWebSocket()
      })
    } else {
      setConnectionStatus(ConnectionStatus.CONNECTING)
      initializeWebSocket()
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate().then(() => {
          console.log("🔴 WebSocket connection closed.")
          setConnectionStatus(ConnectionStatus.DISCONNECTED)
        })
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [token])

  const handleTokenError = async (errorMsg: string) => {
    console.error("Token error detected:", errorMsg)

    if (
      errorMsg.includes("JWT expired") ||
      errorMsg.includes("Unauthorized") ||
      errorMsg.includes("Invalid token")
    ) {
      setConnectionError("Token đã hết hạn, đang thử làm mới token...")
      setConnectionStatus(ConnectionStatus.ERROR)

      try {
        // Try to refresh the token
        const success = await authenticationStore.refreshAuthToken()

        if (success) {
          console.log("Token refreshed successfully, reconnecting WebSocket...")
          setConnectionError(undefined)
          // Token refresh is successful, the useEffect will trigger a new connection
        } else {
          // Refresh failed, show error and logout
          handleAuthFailure()
        }
      } catch (error) {
        console.error("Error refreshing token:", error)
        handleAuthFailure()
      }
    } else {
      setConnectionError(`Lỗi kết nối: ${errorMsg}`)
      setConnectionStatus(ConnectionStatus.ERROR)

      // Try to reconnect after a delay
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        console.log("Attempting to reconnect WebSocket...")
        initializeWebSocket()
      }, 5000)
    }
  }

  const handleAuthFailure = () => {
    setConnectionError("Phiên đăng nhập đã hết hạn và không thể làm mới. Vui lòng đăng nhập lại.")
    setConnectionStatus(ConnectionStatus.ERROR)

    Alert.alert(
      "Phiên đăng nhập hết hạn",
      "Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.",
      [
        {
          text: "Đăng nhập lại",
          onPress: () => authenticationStore.logout(),
        },
      ],
    )
  }

  const initializeWebSocket = () => {
    if (!token) return

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/ws?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.debug("DEBUG: " + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      console.log("✅ Connected to STOMP")
      setConnectionStatus(ConnectionStatus.CONNECTED)
      setConnectionError(undefined)
    }

    client.onDisconnect = () => {
      console.log("❌ Disconnected from STOMP")
      setConnectionStatus(ConnectionStatus.DISCONNECTED)
    }

    client.onStompError = (frame) => {
      console.error("🚫 STOMP Error:", frame.headers.message)
      handleTokenError(frame.headers.message || "Unknown connection error")
    }

    client.onWebSocketError = (event) => {
      console.error("🚫 WebSocket Error:", event)
      handleTokenError("Cannot connect to server")
    }

    client.activate()
    clientRef.current = client
  }

  const sendMessage = (message: Message, destination: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } else {
      console.warn("⚠️ WebSocket not connected. Unable to send message.")
      if (connectionStatus === ConnectionStatus.ERROR) {
        Alert.alert(
          "Cannot send message",
          connectionError ?? "Please check your network connection and login again",
        )
      }
    }
  }

  const sendCallMessage = (message: CallMessage, destination: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } else {
      console.warn("⚠️ WebSocket not connected. Unable to send message.")
      if (connectionStatus === ConnectionStatus.ERROR) {
        Alert.alert(
          "Cannot connect call",
          connectionError ?? "Please check your network connection and login again",
        )
      }
    }
  }

  const subscribe = (url: string, callback: CallbackMessage) => {
    if (!clientRef.current?.connected) {
      console.warn("⚠️ Cannot subscribe, WebSocket not connected.")
      if (connectionStatus === ConnectionStatus.ERROR) {
        Alert.alert(
          "Cannot subscribe",
          connectionError ?? "Please check your connection and login again",
        )
      }
      return
    }

    const headers: StompHeaders = {
      Authorization: `Bearer ${token}`,
    }
    const messageCallback: messageCallbackType = (data: IMessage) => {
      callback?.(JSON.parse(data.body))
    }
    const subscription = clientRef.current.subscribe(url, messageCallback, headers)
    subscriptions.current.set(url, subscription.id)
  }

  const unsubscribe = (url: string) => {
    const subscriptionId = subscriptions.current.get(url)
    if (subscriptionId) {
      clientRef.current?.unsubscribe(subscriptionId)
      subscriptions.current.delete(url)
      console.log(`🔴 Unsubscribed from ${url}`)
    } else {
      console.warn(`⚠️ No active subscription found for ${url}`)
    }
  }

  const contextValue = useMemo(
    () => ({
      sendMessage,
      sendCallMessage,
      subscribe,
      unsubscribe,
      connectionStatus,
      connectionError,
    }),
    [token, connectionStatus, connectionError],
  )

  return <StompContext.Provider value={contextValue}>{children}</StompContext.Provider>
}

export const useStomp = () => {
  const context = useContext(StompContext)
  if (!context) {
    throw new Error("useStomp must be used within a StompProvider")
  }
  return context
}
