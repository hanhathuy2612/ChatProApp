import { User } from "app/API/types/user.types"

export type Message = {
  id?: string
  type?: keyof typeof ChatType
  content?: string
  sender?: User
  room: Room
}

export type Room = {
  id: string
  name?: string
  imageUrl?: string
  lastMessage?: Message
  appUsers?: User[]
}

export type NewRoom = Omit<Room, "id">

export enum ChatType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
  TYPING = "TYPING",
}
