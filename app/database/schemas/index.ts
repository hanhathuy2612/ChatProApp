import { appSchema } from "@nozbe/watermelondb"
import { messageSchema } from "./MessageSchema"

export default appSchema({
  version: 1,
  tables: [messageSchema],
})
