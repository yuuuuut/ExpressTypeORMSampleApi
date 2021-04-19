import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { Room, User } from '.'

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ nullable: false })
  kind: 'LINE' | 'Twitter'

  @Column({ default: false })
  isApproval: boolean

  @Column({ default: false })
  rejected: boolean

  @ManyToOne((type) => User, (user) => user.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne((type) => Room, (room) => room.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room
}
