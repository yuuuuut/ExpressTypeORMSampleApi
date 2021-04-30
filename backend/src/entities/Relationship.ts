import { BaseEntity, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from '.'

@Entity('relationships')
@Unique(['followed', 'follower'])
export class Relationship extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @ManyToOne(() => User, (user) => user.followings, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'followed_id' })
  followed: User

  @ManyToOne(() => User, (user) => user.followers, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: User
}
