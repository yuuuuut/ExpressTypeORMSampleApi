import { BaseEntity, Entity, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { Message, User } from '.'

@Entity('rooms')
export class Room extends BaseEntity {
  @PrimaryColumn()
  id: string

  @OneToMany((type) => Message, (messages) => messages.room)
  messages: Message[]

  @ManyToMany((type) => User, (user) => user.rooms)
  users: User[]
}
