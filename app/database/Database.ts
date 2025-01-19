import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"
import migrations from "./migrations"
import { Message } from "./models/Message"
import schema from "./schemas"

export class DatabaseService {
  private readonly database: Database

  constructor() {
    const adapter = new SQLiteAdapter({
      schema,
      migrations,
      jsi: true,
      onSetUpError: (error) => {
        console.error("Database setup error:", error)
      },
    })

    this.database = new Database({
      adapter,
      modelClasses: [Message],
    })
  }

  getDatabase() {
    return this.database
  }
}
