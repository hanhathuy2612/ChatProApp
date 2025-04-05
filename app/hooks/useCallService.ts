import { useEffect, useRef, useState } from "react"
import { useStomp } from "app/contexts/StompContext"
import { mediaDevices } from "react-native-webrtc"
import { AnswerMessage, ChatType, OfferMessage, Message, Room } from "app/API"

export const useCallService = () => {
  const { sendMessage, subscribe, unsubscribe } = useStomp()
  const peerConnection = useRef<RTCPeerConnection | null>(null)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const currentRoomId = useRef<string | null>(null)

  useEffect(() => {
    return () => {
      leaveRoom()
    }
  }, [])

  const initializePeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:localhost:3478" },
        {
          urls: "turn:localhost:3478",
          username: "username",
          credential: "password",
        },
      ],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate && currentRoomId.current) {
        const iceMessage = {
          type: ChatType.ICE_CANDIDATE,
          candidate: event.candidate,
          room: { id: currentRoomId.current }
        }
        sendMessage(iceMessage, `/topic/room/${currentRoomId.current}`)
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    peerConnection.current = pc
  }

  const startLocalStream = async () => {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })
      setLocalStream(stream as unknown as MediaStream)
      return stream
    } catch (error) {
      console.error("Error getting user media:", error)
      throw error
    }
  }

  const joinRoom = async (roomId: string) => {
    currentRoomId.current = roomId
    initializePeerConnection()

    const stream = await startLocalStream()
    
    // Add tracks to peer connection
    if (peerConnection.current) {
      stream.getTracks().forEach((track) => {
        if (peerConnection.current && stream) {
          peerConnection.current.addTrack(
            track as unknown as MediaStreamTrack, 
            stream as unknown as MediaStream
          )
        }
      })
    }

    subscribe(`/topic/room/${roomId}`, async (message: Message) => {
      if (message.type === "OFFER") {
        const offerMessage = message as OfferMessage
        await handleOffer(offerMessage.offer)
      } else if (message.type === "ANSWER") {
        const answerMessage = message as AnswerMessage
        await handleAnswer(answerMessage.answer)
      } else if (message.type === "ICE_CANDIDATE") {
        const iceMessage = message as { candidate: RTCIceCandidateInit }
        await handleIceCandidate(iceMessage.candidate)
      }
    })

    // Create room object for message
    const room: Room = { id: roomId }
    sendMessage({ type: ChatType.JOIN, room }, `/topic/room/${roomId}`)
  }

  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnection.current) return
    await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer))

    const answer = await peerConnection.current.createAnswer()
    await peerConnection.current.setLocalDescription(answer)

    if (currentRoomId.current) {
      const room: Room = { id: currentRoomId.current }
      const answerMessage = { 
        type: ChatType.ANSWER, 
        answer,
        room
      }
      sendMessage(answerMessage, `/topic/room/${currentRoomId.current}`)
    }
  }

  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer))
    }
  }

  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (peerConnection.current) {
      await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate))
    }
  }

  const leaveRoom = () => {
    if (currentRoomId.current) {
      unsubscribe(`/topic/room/${currentRoomId.current}`)
      const room: Room = { id: currentRoomId.current }
      sendMessage({ type: ChatType.LEAVE, room }, `/topic/room/${currentRoomId.current}`)
    }
    peerConnection.current?.close()
    peerConnection.current = null
    setLocalStream(null)
    setRemoteStream(null)
    currentRoomId.current = null
  }

  return { localStream, remoteStream, joinRoom, leaveRoom }
}
