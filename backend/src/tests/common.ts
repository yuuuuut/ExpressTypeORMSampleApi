import request from 'supertest'
import { getManager } from 'typeorm'

import { User } from '../entities'

const ApiReq = request('http://localhost:4000/api')

/**
 * Test用Userを作成する。
 */
async function createTestUser() {
  const userRepository = getManager().getRepository(User)

  const user = new User()
  user.id = 'TestUser'
  user.displayName = 'TestUserName'
  user.photoURL = 'TestUserPhoto'

  const userData = await userRepository.save(user)
  if (!userData) throw new Error('Test Failed')

  return userData
}

async function deleteTestUser(id: string) {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(id)

  if (user) await userRepository.delete(id)
}

export { ApiReq, deleteTestUser, createTestUser }
