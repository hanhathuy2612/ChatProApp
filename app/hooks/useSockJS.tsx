import { useEffect, useRef, useState } from "react"
import SockJS from "sockjs-client"
import { CompatClient, IFrame, Stomp, StompHeaders } from "@stomp/stompjs"
import { ChatMessage } from "app/models/ChatMessage"
import config from "app/config"
import { useStores } from "app/models"

const useSockJs = () => {
  const { authenticationStore: { authEmail } } = useStores()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [lastMessage, setLastMessage] = useState<ChatMessage>()
  const stompClient = useRef<CompatClient | null>(null)

  const sendMessage = (message: ChatMessage) => {
    if (stompClient?.current?.connected) {
      stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(message))
    } else {
      console.error("Socket is not connected.")
    }
  }

  const onMessage = (frame: IFrame) => {
    if (__DEV__) {
      console.log("Socket connected", frame.body)
    }
    setIsConnected(true)

    stompClient.current?.subscribe("/topic/public", (messageOutput) => {
      setLastMessage(JSON.parse(messageOutput.body))
    })
  }

  const onError = (frame: IFrame) => {
    console.error("Socket connection error", frame.body)
  }

  const stompFactory = (url: string) => {
    return new SockJS(url)
  }

  useEffect(() => {
    const url = `http://${config.SERVER_HOST}:8080/ws`

    stompClient.current = Stomp.over(() => stompFactory(url))

    const headers: StompHeaders = {
      forceBinaryWSFrames: "true",
      appendMissingNULLonIncoming: "true",
    }

    stompClient.current.connect(
      headers,
      onMessage,
      onError,
    )

    return () => {
      stompClient?.current?.disconnect(() => {
        setIsConnected(false)
      })
    }
  }, [authEmail])

  return {
    sendMessage,
    lastMessage,
    isConnected
  }
}

export default useSockJs