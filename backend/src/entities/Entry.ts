import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'

import { Room, User } from '.'

@Entity('entries')
@Unique(['user', 'room'])
export class Entry extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'send_message_count', default: 0 })
  sendMessageCount: number

  @ManyToOne((type) => User, (user) => user.entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne((type) => Room, (room) => room.entries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_id' })
  room: Room
}
