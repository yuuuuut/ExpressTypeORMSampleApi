import { getManager } from 'typeorm'

import * as profileModel from './profile.model'
import { User } from '../entities'

/**
 * user index model
 */
const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find()

  return users
}

/**
 * user show model
 */
const show = async (id: string) => {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(id)
  if (!user)
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return { user }
}

/**
 * user create model
 */
const create = async (body: Pick<User, 'id' | 'displayName' | 'photoURL'>) => {
  const userRepository = getManager().getRepository(User)

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

export { index, show, create }
