import { BaseEntity, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Entry, Message } from "."

@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @OneToMany((type) => Entry, (entries) => entries.room)
  entries: Entry[]

  @OneToMany((type) => Message, (messages) => messages.room)
  messages: Message[]
}