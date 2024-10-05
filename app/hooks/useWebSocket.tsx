import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "app/models/ChatMessage"
import config from "app/config"
import { useStores } from "app/models"

type UseWebSocketHook = {
  messages: ChatMessage[];
  lastMessage?: ChatMessage;
  sendMessage: (message: ChatMessage) => void;
  isConnected: boolean;
  setMessages: any;
};

const useWebSocket = (): UseWebSocketHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [lastMessage, setLastMessage] = useState<ChatMessage>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const ws = useRef<WebSocket | null>(null)
  const { authenticationStore: { authEmail } } = useStores()

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(`ws://${config.SERVER_HOST}:8080/ws`)

      ws.current.onopen = (event) => {
        if (__DEV__) {
          console.log("Connected to WebSocket: ", event)
        }
        setIsConnected(true)
        ws?.current?.send(JSON.stringify({
          type: "CONNECTED", sender: {
            email: authEmail,
          },
        } as ChatMessage))
      }

      ws.current.onmessage = (event) => {
        if (__DEV__) {
          console.log("Received:", event.data)
        }

        setLastMessage(JSON.parse(event.data))
      }

      ws.current.onerror = (error) => {
        if (__DEV__) {
          console.error("WebSocket error:", (error as any).message)
        }
      }

      ws.current.onclose = () => {
        if (__DEV__) {
          console.log("WebSocket connection closed")
        }

        ws?.current?.send(JSON.stringify({
          type: "DISCONNECTED", sender: {
            email: authEmail,
          },
        } as ChatMessage))
      }
    }

    return () => {
      ws?.current?.close()
    }
  }, [])

  const sendMessage = (message: ChatMessage) => {
    ws?.current?.send(JSON.stringify(message))
  }

  return { messages, lastMessage, sendMessage, isConnected, setMessages }
}

export default useWebSocket