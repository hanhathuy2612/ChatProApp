import { Model } from "@nozbe/watermelondb"
import { field, date, readonly } from "@nozbe/watermelondb/decorators"

export class Message extends Model {
  static readonly table = "messages"

  @field("content") content!: string
  @field("sender_id") senderId!: string
  @field("room_id") roomId!: string
  @field("is_read") isRead!: boolean
  @readonly @date("created_at") createdAt!: Date

  async markAsRead() {
    await this.update((message) => {
      message.isRead = true
    })
  }
}
