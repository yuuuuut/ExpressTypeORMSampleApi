import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm'

import { Message, Notification, Profile, Relationship, Room, Tag } from '.'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  id!: string

  @Column({ nullable: false, name: 'display_name' })
  displayName?: string

  @Column({ nullable: false, name: 'photo_url' })
  photoURL?: string

  @Column({ default: false })
  isAdmin: boolean

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile?: Profile

  @OneToMany(() => Message, (messages) => messages.user)
  messages: Message[]

  @OneToMany(() => Notification, (notification) => notification.visiter)
  active_notifications: Notification[]

  @OneToMany(() => Notification, (notification) => notification.visited)
  passive_notifications: Notification[]

  @OneToMany(() => Relationship, (followings) => followings.followed)
  followings: Relationship[]

  followingsCount: number
  @AfterLoad()
  async countFollowings() {
    const { count } = await Relationship.createQueryBuilder('relationship')
      .where('relationship.followed = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne()

    this.followingsCount = count
  }

  @OneToMany(() => Relationship, (followers) => followers.follower)
  followers: Relationship[]

  followersCount: number
  @AfterLoad()
  async countFollowers() {
    const { count } = await Relationship.createQueryBuilder('relationship')
      .where('relationship.follower = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne()

    this.followersCount = count
  }

  @ManyToMany(() => Tag, (tag) => tag.users)
  @JoinTable({
    name: 'users_tags',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[]

  @ManyToMany(() => Room, (room) => room.users)
  @JoinTable({
    name: 'entries',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'room_id',
      referencedColumnName: 'id',
    },
  })
  rooms: Room[]

  @AfterLoad()
  async nullChecks() {
    if (!this.rooms) {
      this.rooms = []
    }
  }
}
