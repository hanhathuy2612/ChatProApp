import { User } from "app/API/types/user.types"

export type Message = {
  id?: string
  type?: keyof typeof ChatType
  content?: string
  sender?: User
  room?: Room
}

export type IceCandidateMessage = Message & {
  candidate: RTCIceCandidate
  type: ChatType.ICE_CANDIDATE
}

export type OfferMessage = Message & {
  offer: RTCSessionDescriptionInit;
}

export type AnswerMessage = Message & {
  answer: RTCSessionDescriptionInit;
}

export type Room = {
  id: string
  name?: string
  imageUrl?: string
  lastMessage?: Message
  roomMembers?: RoomMember[]
}

export type RoomMember = {
  id?: string;
  member: User;
  room: Room
}

export type CreateRoomRequest =  {
  members: User[]
}

export enum ChatType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  TYPING = "TYPING",
  OFFER = "OFFER",
  ICE_CANDIDATE = "ICE_CANDIDATE",
  ANSWER = "ANSWER",
}
