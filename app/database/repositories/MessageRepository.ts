import { Database, Q, Collection } from "@nozbe/watermelondb"
import { Message } from "app/database"

export class MessageRepository {
  private readonly messages: Collection<Message>

  constructor(private readonly database: Database) {
    this.messages = database.collections.get<Message>(Message.table)
  }

  // Create
  async create(messageData: Partial<Message>) {
    return await this.database.write(async () => {
      return await this.messages.create((message) => {
        Object.assign(message, messageData)
      })
    })
  }

  // Read
  async getByRoom(roomId: string, limit = 50) {
    return await this.messages
      .query(Q.where("room_id", roomId), Q.sortBy("created_at", "desc"), Q.take(limit))
      .fetch()
  }

  // Update
  async update(id: string, changes: Partial<Message>) {
    return await this.database.write(async () => {
      const message = await this.messages.find(id)
      await message.update((msg) => {
        Object.assign(msg, changes)
      })
    })
  }

  // Delete
  async delete(id: string) {
    return await this.database.write(async () => {
      const message = await this.messages.find(id)
      await message.markAsDeleted()
    })
  }

  // Queries additional
  async getUnreadCount(roomId: string) {
    return await this.messages
      .query(Q.where("room_id", roomId), Q.where("is_read", false))
      .fetchCount()
  }
}
