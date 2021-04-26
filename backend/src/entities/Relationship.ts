import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'

import { User } from '.'

@Entity('relationships')
@Unique(['user', 'follow'])
export class Relationship extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @ManyToOne((type) => User, (user) => user.followings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User

  @ManyToOne((type) => User, (user) => user.followers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follow_id' })
  follow: User
}
