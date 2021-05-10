import { FindOneOptions, getManager } from 'typeorm'

import { Message, Profile, Room, Tag, User } from '@/entity'

/**
 * Userを返します。
 */
export async function getOneUser(userId: string, options?: FindOneOptions<User>) {
  let user: User | undefined
  const userRepository = getManager().getRepository(User)

  if (options) {
    user = await userRepository.findOne(userId, {
      ...options,
    })
  } else {
    user = await userRepository.findOne(userId)
  }

  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return user
}

/**
 * Profileを返します。
 */
export async function getOneProfile(user: User, options?: FindOneOptions<Profile>) {
  let profile: Profile | undefined
  const profileRepository = getManager().getRepository(Profile)

  if (options) {
    profile = await profileRepository.findOne(user.profile, {
      ...options,
    })
  } else {
    profile = await profileRepository.findOne(user.profile)
  }

  if (!profile) throw Object.assign(new Error('プロフィールが存在しません。'), { status: 404 })

  return profile
}

/**
 * Roomを返します。
 */
export async function getOneRoom(roomId: string, options?: FindOneOptions<Room>) {
  let room: Room | undefined
  const roomRepository = getManager().getRepository(Room)

  if (options) {
    room = await roomRepository.findOne(roomId, {
      ...options,
    })
  } else {
    room = await roomRepository.findOne(roomId)
  }

  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  return room
}

/**
 * Messageを返します。
 */
export async function getOneMessage(messageId: string, options?: FindOneOptions<Message>) {
  let message: Message | undefined
  const messageRepository = getManager().getRepository(Message)

  if (options) {
    message = await messageRepository.findOne(messageId, {
      ...options,
    })
  } else {
    message = await messageRepository.findOne(messageId)
  }

  if (!message) throw Object.assign(new Error('メッセージが存在しません。'), { status: 404 })

  return message
}

/**
 * Tagを返します。
 */
export async function getOneTag(tagId: string, options?: FindOneOptions<Tag>) {
  let tag: Tag | undefined
  const tagRepository = getManager().getRepository(Tag)

  if (options) {
    tag = await tagRepository.findOne(tagId, {
      ...options,
    })
  } else {
    tag = await tagRepository.findOne(tagId)
  }

  if (!tag) throw Object.assign(new Error('タグが存在しません。'), { status: 404 })

  return tag
}
