import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'
import { Room, User } from '.'

@Entity('messages')
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ nullable: false })
  kind: 'LINE' | 'TWITTER'

  @Column({ default: false })
  isApproval: boolean

  @Column({ default: false })
  rejected: boolean

  @Column({ default: false, nullable: false })
  checked: boolean

  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne(() => Room, (room) => room.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'room_id' })
  room: Room
}
