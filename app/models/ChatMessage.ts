import { AppUser } from "app/models/User"

export type ChatMessage = {
  id?: number,
  type?: keyof typeof ChatType,
  content?: string,
  sender?: AppUser,
  room: Room
}

export type Room = {
  id: number;
  name?: string;
  imageUrl?: string;
};

export enum ChatType {
  CHAT = "CHAT",
  JOIN = "JOIN",
  LEAVE = "LEAVE"
}