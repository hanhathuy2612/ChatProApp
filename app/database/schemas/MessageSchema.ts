import { tableSchema } from "@nozbe/watermelondb"

export const messageSchema = tableSchema({
  name: "messages",
  columns: [
    { name: "content", type: "string" },
    { name: "sender_id", type: "string" },
    { name: "room_id", type: "string" },
    { name: "created_at", type: "number" },
    { name: "is_read", type: "boolean" },
  ],
})
