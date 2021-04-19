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

  @Column({ name: 'line_id' })
  lineId: string

  @Column({ name: 'twitter_id' })
  twitterId: string

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User
}
