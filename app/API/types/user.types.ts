import { Room } from "./message.types"

type Authority = {
  name: string
}

export type User = {
  id?: string | null
  login?: string
  password?: string
  firstName?: string
  lastName?: string
  email?: string
  activated?: boolean
  activationKey?: string
  resetKey?: string
  resetDate?: Date | null
  authorities?: Authority[]
  rooms?: Room[]
}

// Utility functions
export const appUserUtils = {
  getName: (user: User): string => {
    return user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : ""
  },
}
