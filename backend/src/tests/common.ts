import { getManager } from 'typeorm'
import request from 'supertest'

import { Message, Profile, Room, User } from '../entities'

// API URL
const Req = request('http://localhost:4000/api')

/**
 * TestUser取得する。
 */
async function getTestUser(userId: string) {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(userId)
  if (!user) throw new Error('Test Failed None User')

  return user
}

/**
 * Test用Userを作成する。
 */
async function createTestUser(name?: string, profile?: Profile) {
  const userRepository = getManager().getRepository(User)
  const newUser = new User()
  newUser.id = name || 'TestUser'
  newUser.displayName = 'TestDisName'
  newUser.photoURL = 'TestUserPhoto'
  newUser.profile = profile || undefined
  const userData = await userRepository.save(newUser)

  const user = await userRepository.findOne(userData.id)
  if (!user) throw new Error('Test Failed')

  return user
}

/**
 * Test用Profileを作成する。
 */
async function createTestProfile() {
  const profileRepository = getManager().getRepository(Profile)
  const profile = new Profile()

  return await profileRepository.save(profile)
}

/**
 * Test用Relationshipを作成する。
 */
async function createTestRelationship(u1: User, u2: User) {
  const userRepository = getManager().getRepository(User)

  const user1 = await userRepository.findOne(u1.id)
  const user2 = await userRepository.findOne(u2.id)
  if (!user1 || !user2) throw new Error('Test Failed')

  user1.followers = [user2]
  //user2.followers = [user1]

  await userRepository.save(user1)
  //await userRepository.save(user2)
}

/**
 * Test用Roomを作成する。
 */
async function createTestRoom(user: User, currentUser: User) {
  const roomRepository = getManager().getRepository(Room)
  const room = new Room()
  room.id = 'TestRoom'
  room.users = [user, currentUser]

  return await roomRepository.save(room)
}

/**
 * Test用Messageを作成する。
 */
async function createTestMessage(user: User, room: Room) {
  const messageRepository = getManager().getRepository(Message)
  const message = new Message()
  message.kind = 'LINE'
  message.user = user
  message.room = room

  return await messageRepository.save(message)
}

export {
  Req,
  getTestUser,
  createTestUser,
  createTestProfile,
  createTestRelationship,
  createTestRoom,
  createTestMessage,
}
