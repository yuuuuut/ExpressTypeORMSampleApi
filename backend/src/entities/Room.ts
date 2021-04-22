import { BaseEntity, Entity, OneToMany, PrimaryColumn } from 'typeorm'
import { Entry, Message } from '.'

@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryColumn()
  id: string

  @OneToMany((type) => Entry, (entries) => entries.room)
  entries: Entry[]

  @OneToMany((type) => Message, (messages) => messages.room)
  messages: Message[]
}
