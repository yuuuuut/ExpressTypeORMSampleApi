import request from 'supertest'
import { getManager } from 'typeorm'

import { User } from '../entities'

const ApiReq = request('http://localhost:4000/api')

async function deleteTestUser(id: string) {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(id)

  if (user) await userRepository.delete(id)
}

export { ApiReq, deleteTestUser }
