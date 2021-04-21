import { Request } from 'express'
import { getManager } from 'typeorm'

import * as profileModel from './profile.model'
import { User } from '../entities'

/**
 *
 */
const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find()

  return users
}

/**
 *
 */
const create = async (req: Request) => {
  const userRepository = getManager().getRepository(User)

  const body = req.body as Pick<User, 'id' | 'displayName' | 'photoURL'>
  const user = await userRepository.findOne(body.id)
  if (!user) {
    const data = await getManager().transaction(async (em) => {
      const userData = em.create(User, {
        id: body.id,
        displayName: body.displayName,
        photoURL: body.photoURL,
      })

      const user = await em.save(userData)
      const profile = await profileModel.create(user, em)

      return { user, profile }
    })

    return { user: data.user, profile: data.profile, isCreate: true }
  } else {
    return { user, profile: null, isCreate: false }
  }
}

export { index, create }
