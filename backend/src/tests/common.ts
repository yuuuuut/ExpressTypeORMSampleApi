import { getManager } from 'typeorm'
import request from 'supertest'

import { Entry, Profile, Relationship, Room, User } from '../entities'

// api url
const Req = request('http://localhost:4000/api')

/**
 * Test用Userを作成する。
 */
async function createTestUser(name?: string) {
  const userRepository = getManager().getRepository(User)

  const user = new User()
  user.id = name || 'TestUser'
  user.displayName = 'TestDisName'
  user.photoURL = 'TestUserPhoto'

  return await userRepository.save(user)
}

/**
 * Test用Profileを作成する。
 */
async function createTestProfile(user: User) {
  const profileRepository = getManager().getRepository(Profile)

  const profile = new Profile()
  profile.user = user

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
 * Test用Userを削除する。
 */
async function deleteTestUser(id: string) {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(id)

  if (user) await userRepository.delete(id)
}

/**
 * Test用Roomを削除する。
 */
async function deleteTestRoom(id: string) {
  const roomRepository = getManager().getRepository(Room)
  const room = await roomRepository.findOne(id)

  if (room) await roomRepository.delete(id)
}

export {
  Req,
  deleteTestUser,
  createTestUser,
  createTestProfile,
  createTestRelationship,
  createTestEntry,
  createTestRoom,
  deleteTestRoom,
}
