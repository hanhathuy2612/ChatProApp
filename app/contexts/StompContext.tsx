import { Client, IMessage } from "@stomp/stompjs"
import { Message } from "app/API/types/message.types"
import config from "app/config"
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react"
import SockJS from "sockjs-client"
import { useStores } from "app/models"

type StompContextType = {
  sendMessage: (message: Message, destination: string) => void;
  subscribe: (url: string, callback: (message: Message) => void) => void;
  unsubscribe: (url: string) => void;
};

type CallbackMessage = (message: Message) => void;

const StompContext = createContext<StompContextType | null>(null)

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null)
  const subscriptions = useRef<Map<string, string>>(new Map())
  const { authenticationStore: { authToken: token } } = useStores()

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ No access token found. WebSocket will not connect.")
      return
    }

    if (clientRef.current) {
      clientRef.current.deactivate().then(() => {
        console.log("🔌 WebSocket disconnected before reconnecting.")
        initializeWebSocket()
      })
    } else {
      initializeWebSocket()
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate().then(() => {
          console.log("🔴 WebSocket connection closed.")
        })
      }
    }
  }, [token])

  const initializeWebSocket = () => {
    if (!token) return

    const client = new Client({
      webSocketFactory: () => new SockJS(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/ws?token=${token}`),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => console.log("DEBUG: " + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    client.onConnect = () => {
      console.log("✅ Connected to STOMP")
    }

    client.onDisconnect = () => {
      console.log("❌ Disconnected from STOMP")
    }

    client.activate()
    clientRef.current = client
  }

  const sendMessage = (message: Message, destination: string) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(message) })
    } else {
      console.warn("⚠️ WebSocket not connected. Unable to send message.")
    }
  }

  const subscribe = (url: string, callback: CallbackMessage) => {
    if (!clientRef.current?.connected) {
      console.warn("⚠️ Cannot subscribe, WebSocket not connected.")
      return
    }

    const subscription = clientRef.current.subscribe(url, (data: IMessage) => {
      callback?.(JSON.parse(data.body))
    })

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
      subscribe,
      unsubscribe,
    }),
    [token],
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