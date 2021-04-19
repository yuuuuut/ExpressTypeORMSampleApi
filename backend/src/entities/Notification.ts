import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '.'

@Entity('notifications')
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ nullable: false })
  action: 'FOLLOW' | 'MESSAGE'

  @Column({ default: false, nullable: false })
  checked: boolean

  @ManyToOne((type) => User, (visiter) => visiter.active_notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visiter_id' })
  visiter: User

  @ManyToOne((type) => User, (visited) => visited.passive_notifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'visited_id' })
  visited: User
}
