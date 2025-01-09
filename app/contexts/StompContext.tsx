import { Client, IMessage } from "@stomp/stompjs"
import config from "app/config"
import { ChatMessage } from "app/models/ChatMessage"
import React, { createContext, useContext, useEffect, useMemo, useRef } from "react"
import SockJS from "sockjs-client"

interface StompContextType {
  sendMessage: (message: ChatMessage, destination: string) => void
  subscribe: (url: string, callback: (message: IMessage) => void) => void
  unsubscribe: (url: string) => void
}

const StompContext = createContext<StompContextType | null>(null)

export const StompProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!clientRef.current) {
      const client = new Client({
        webSocketFactory: () => {
          return new SockJS(`http://${config.SERVER_HOST}:${config.SERVER_PORT}/ws`);
        },
        connectHeaders: {
          forceBinaryWSFrames: "true",
          appendMissingNULLonIncoming: "true",
        },
        debug: (str) => {
          console.log("STOMP: " + str)
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      })

      client.onConnect = () => {
        console.log("Connected to STOMP")
      }

      client.onDisconnect = () => {
        console.log("Disconnected from STOMP")
      }

      client.activate()
      clientRef.current = client
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
      }
    }
  }, [])

  const sendMessage = (message: ChatMessage, destination: string) => {
    if (clientRef.current) {
      clientRef.current.publish({ destination: destination, body: JSON.stringify(message) })
    }
  }

  const subscribe = (url: string, callback: (message: IMessage) => void) => {
    clientRef.current?.subscribe(url, callback)
  }

  const unsubscribe = (url: string) => {
    clientRef.current?.unsubscribe(url)
  }

  const contextValue = useMemo(
    () => ({
      sendMessage,
      subscribe,
      unsubscribe,
    }),
    [clientRef.current],
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
