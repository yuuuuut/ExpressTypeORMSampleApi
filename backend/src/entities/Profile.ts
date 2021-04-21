import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

import { User } from '.'

@Entity('profiles')
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ name: 'line_id', nullable: true })
  lineId: string

  @Column({ name: 'twitter_id', nullable: true })
  twitterId: string

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
}
