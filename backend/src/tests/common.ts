import { getManager } from 'typeorm'
import request from 'supertest'

import { Entry, Message, Profile, Relationship, Room, User } from '../entities'

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
async function createTestRelationship(currentUser: User, followUser: User) {
  const relationshipRepository = getManager().getRepository(Relationship)
  const relationship = new Relationship()
  relationship.user = currentUser
  relationship.follow = followUser

  await relationshipRepository.save(relationship)
}

/**
 * Test用Entryを作成する。
 */
async function createTestEntry(user: User, room: Room) {
  const entryRepository = getManager().getRepository(Entry)
  const entry = new Entry()
  entry.room = room
  entry.user = user

  return await entryRepository.save(entry)
}

/**
 * Test用Roomを作成する。
 */
async function createTestRoom() {
  const roomRepository = getManager().getRepository(Room)
  const room = new Room()
  room.id = 'TestRoom'

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
  createTestEntry,
  createTestRoom,
  createTestMessage,
}
