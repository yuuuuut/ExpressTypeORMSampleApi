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

import { Message, Notification, Profile, Room, Tag } from '.'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn({ nullable: false, unique: true })
  id: string

  @Column({ nullable: false, name: 'display_name' })
  displayName?: string

  @Column({ nullable: false, name: 'photo_url' })
  photoURL?: string

  @Column({ default: false })
  isAdmin: boolean

  @OneToOne(() => Profile)
  @JoinColumn({ name: 'profile_id' })
  profile?: Profile

  @OneToMany((type) => Message, (messages) => messages.user)
  messages: Message[]

  @OneToMany((type) => Notification, (notification) => notification.visiter)
  active_notifications: Notification[]

  @OneToMany((type) => Notification, (notification) => notification.visited)
  passive_notifications: Notification[]

  /*
  @OneToMany((type) => Relationship, (followings) => followings.user)
  followings: Relationship[]

  followingsCount: number
  @AfterLoad()
  async countFollowings() {
    const { count } = await Relationship.createQueryBuilder('relationship')
      .where('relationship.user = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne()

    this.followingsCount = count
  }

  @OneToMany((type) => Relationship, (followers) => followers.follow)
  followers: Relationship[]

  followersCount: number
  @AfterLoad()
  async countFollowers() {
    const { count } = await Relationship.createQueryBuilder('relationship')
      .where('relationship.follow = :id', { id: this.id })
      .select('COUNT(*)', 'count')
      .getRawOne()

    this.followersCount = count
  }
  */

  @ManyToMany((type) => User, (user) => user.followings)
  @JoinTable({
    name: 'relationships',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'follow_id',
      referencedColumnName: 'id',
    },
  })
  followers: User[]

  @ManyToMany((type) => User, (user) => user.followers)
  followings: User[]

  /*
  @ManyToMany((type) => User, (user) => user.followers)
  @JoinTable({
    name: 'relationships',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'follow_id',
      referencedColumnName: 'id',
    },
  })
  followings: User[]

  @ManyToMany((type) => User, (user) => user.followings)
  @JoinTable({
    name: 'relationships',
    joinColumn: {
      name: 'follow_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  followers: User[]
  */

  @ManyToMany((type) => Tag, (tag) => tag.users)
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

  @ManyToMany((type) => Room, (room) => room.users)
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
}
