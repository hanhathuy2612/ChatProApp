import { useEffect, useRef, useState } from "react"
import { Client, IMessage } from "@stomp/stompjs"
import { ChatMessage } from "app/models/ChatMessage"
import { WebSocket } from "ws"
import { TextEncoder, TextDecoder } from 'fast-text-encoding';

Object.assign(global, { WebSocket, TextDecoder, TextEncoder })


type UseStompClientHook = {
  messages: ChatMessage[];
  sendMessage: (message: ChatMessage, destination: string) => void;
  isConnected: boolean;
};

const useStompClient = (brokerURL: string, topic: string): UseStompClientHook => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const client = new Client({
      brokerURL,
      reconnectDelay: 5000,
      onConnect: (frame) => {
        console.log("onConnect", frame)
        setIsConnected(true)
        client.subscribe(topic, (message: IMessage) => {
          setMessages([...messages, JSON.parse(message.body || "{}")])
        })
      },
      onDisconnect: () => {
        setIsConnected(false)
      },
      onStompError: (frame) => {
        console.error("Broker reported error: ", frame.headers.message)
        console.error("Additional details: ", frame.body)
      },
    })

    client.activate()
    //
    // clientRef.current = client
    //
    // return () => {
    //   client.deactivate().then()
    //   console.log("disconnected")
    // }
  }, [brokerURL, topic])

  const sendMessage = (message: ChatMessage, destination: string): void => {
    if (clientRef.current && isConnected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
      })
    } else {
      console.error("STOMP client is not connected.")
    }
  }

  return { messages, sendMessage, isConnected }
}

export default useStompClient
