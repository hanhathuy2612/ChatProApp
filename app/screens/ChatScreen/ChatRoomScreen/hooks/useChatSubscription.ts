import { useEffect } from "react"
import { useStomp } from "app/contexts/StompContext"
import { Message } from "app/API"

export const useChatSubscription = (
  roomId: string,
  accountId: string,
  handleNewMessage: (message: Message) => void
) => {
  const { subscribe, unsubscribe } = useStomp()

  useEffect(() => {
    subscribe(`/chat/user/${accountId}`, handleNewMessage)

    return () => {
      unsubscribe(`/chat/user/${accountId}`)
      unsubscribe(`/chat/user/${accountId}/typing`)
    }
  }, [roomId])

  return { subscribe, unsubscribe }
}
