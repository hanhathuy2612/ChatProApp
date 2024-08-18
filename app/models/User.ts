import { Room } from "app/models/ChatMessage"

type Authority = {
  // Define the properties for Authority
};

export type AppUser = {
  id?: number; // Java Long maps to TypeScript number; optional since it may be null/undefined
  login?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  activated?: boolean; // Default value in TypeScript is false
  activationKey?: string;
  resetKey?: string;
  resetDate?: Date | null; // Instant maps to Date; can be null
  authorities?: Authority[]; // Default value in TypeScript is an empty array
  rooms?: Room[]; // Default value in TypeScript is an empty array
};