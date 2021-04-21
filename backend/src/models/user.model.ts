import { Request } from 'express'
import { getManager } from 'typeorm'

import { User } from '../entities'

const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find()

  return users
}

const create = async (req: Request) => {
  const userRepository = getManager().getRepository(User)

  const body = req.body as Pick<User, 'id' | 'displayName' | 'photoURL'>
  const user = await userRepository.findOne(body.id)
  if (!user) {
    const user = new User()
    user.id = body.id
    user.displayName = body.displayName
    user.photoURL = body.photoURL

    await userRepository.save(user)

    return { user, isCreate: true }
  }

  return { user, isCreate: false }
}

export { index, create }
