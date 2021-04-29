import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '.'

@Entity('tags')
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id: number

  @Column({ nullable: false, unique: true })
  name: string

  @ManyToMany((type) => User, (user) => user.tags)
  users: User[]
}
