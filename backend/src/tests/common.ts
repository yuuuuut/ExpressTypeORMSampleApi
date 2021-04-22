import request from 'supertest'
import { getManager } from 'typeorm'

import { Profile, Relationship, User } from '../entities'

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

  const userData = await userRepository.save(user)
  if (!userData) throw new Error('Test Failed')

  return userData
}

/**
 * Test用Profileを作成する。
 */
async function createTestProfile(user: User) {
  const profileRepository = getManager().getRepository(Profile)

  const profile = new Profile()
  profile.user = user

  const profileData = await profileRepository.save(profile)
  if (!profileData) throw new Error('Test Failed')

  return profileData
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
 * Test用Userを削除する。
 */
async function deleteTestUser(id: string) {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(id)

  if (user) await userRepository.delete(id)
}

export {
  Req,
  deleteTestUser,
  createTestUser,
  createTestProfile,
  createTestRelationship,
}
