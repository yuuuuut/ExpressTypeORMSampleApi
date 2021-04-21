import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'

import { Entry, Message, Notification, Profile, Relationship, Tag } from '.'

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

  @OneToMany((type) => Entry, (entries) => entries.user)
  entries: Entry[]

  @OneToMany((type) => Message, (messages) => messages.user)
  messages: Message[]

  @OneToMany((type) => Relationship, (followings) => followings.user)
  followings: User[]

  @OneToMany((type) => Relationship, (followers) => followers.user)
  followers: User[]

  @OneToMany((type) => Notification, (notification) => notification.visiter)
  active_notifications: Notification[]

  @OneToMany((type) => Notification, (notification) => notification.visited)
  passive_notifications: Notification[]

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
}
