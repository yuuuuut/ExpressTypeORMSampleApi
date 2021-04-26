import { AfterLoad, BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from 'typeorm'
import { Entry, Message, Notification, Relationship, Tag } from '.'

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
