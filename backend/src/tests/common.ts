import { getManager } from 'typeorm'
import request from 'supertest'

import { Message, Profile, Room, Tag, User } from '@/entities'

// API URL
const Req = request('http://localhost:4000/api')

/**
 * @description TestUser取得する。
 * @param userId UserのID。
 */
async function getTestUser(userId: string) {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['rooms'],
  })
  if (!user) throw new Error('Test Failed None User')

  return user
}

/**
 * @description Test用Userを作成する。
 * @param userId UserのID。
 * @param profile Profile Entity
 */
async function createTestUser(userId?: string, profile?: Profile) {
  const userRepository = getManager().getRepository(User)

  const newUser = new User()
  newUser.id = userId || 'TestUser'
  newUser.displayName = 'TestDisName'
  newUser.photoURL = 'TestUserPhoto'
  newUser.profile = profile || undefined
  const userData = await userRepository.save(newUser)

  const user = await userRepository.findOne(userData.id)
  if (!user) throw new Error('Test Failed: createTestUser')

  return user
}

/**
 * @description Test用Profileを作成する。
 */
async function createTestProfile() {
  const profileRepository = getManager().getRepository(Profile)

  const profile = new Profile()

  return await profileRepository.save(profile)
}

/**
 * @description Test用Relationshipを作成する。
 * @param currentUserId CurrentUserのID。
 * @param userId UserのID。
 */
async function createTestRelationship(currentUserId: string, userId: string) {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId, {
    relations: ['followings', 'followers'],
  })
  if (!currentUser) throw new Error('Test Failed: createTestRelationship')

  const user = await userRepository.findOne(userId, {
    relations: ['followings', 'followers'],
  })
  if (!user) throw new Error('Test Failed: createTestRelationship')

  user.followers.push(currentUser)
  await user.save()
}

/**
 * @description Test用Roomを作成する。
 * @param user User Entity
 * @param currentUser User Entity
 */
async function createTestRoom(user: User, currentUser: User) {
  const roomRepository = getManager().getRepository(Room)

  const room = new Room()
  room.id = 'TestRoom'
  room.users = [user, currentUser]

  return await roomRepository.save(room)
}

/**
 * @description Test用Messageを作成する。
 * @param user User Entity
 * @param room Room Entity
 */
async function createTestMessage(user: User, room: Room) {
  const messageRepository = getManager().getRepository(Message)

  const message = new Message()
  message.kind = 'LINE'
  message.user = user
  message.room = room

  return await messageRepository.save(message)
}

/**
 * @description Test用Tagを作成する。
 */
async function createTestTag() {
  const tag1 = new Tag()
  tag1.name = 'ゲーム'
  const t1 = await tag1.save()

  const tag2 = new Tag()
  tag2.name = '読書'
  const t2 = await tag2.save()

  return [t1, t2]
}

export {
  Req,
  getTestUser,
  createTestUser,
  createTestProfile,
  createTestRelationship,
  createTestRoom,
  createTestMessage,
  createTestTag,
}
