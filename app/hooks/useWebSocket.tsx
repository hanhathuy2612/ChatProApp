import { useEffect, useRef, useState } from "react"
import { ChatMessage } from "app/models/ChatMessage"
import config from "app/config"

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

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(`ws://${config.SERVER_HOST}:8080/ws`)

      ws.current.onopen = (event) => {
        console.log("Connected to WebSocket: ", event)
        setIsConnected(true)
        // ws?.current?.send(JSON.stringify({ content: "Hello, Server!" }))
      }

      ws.current.onmessage = (event) => {
        console.log("Received:", event.data)
        setLastMessage(JSON.parse(event.data))
        setMessages([...messages, JSON.parse(event.data)])
      }

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", (error as any).message)
      }

      ws.current.onclose = () => {
        console.log("WebSocket connection closed")
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