import { getManager } from 'typeorm'

import * as relationshipModel from './relationship.model'
import * as profileModel from './profile.model'
import { UserCreateApiReq } from '../types'
import { User } from '../entities'

/**
 * user index model
 */
const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find({})

  return users
}

/**
 * user show model
 */
const show = async (userId: string, currentUser: User) => {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(userId)
  if (!user)
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const isFollowing = await relationshipModel.isFollowingBool(
    userId,
    currentUser.id
  )
  const isAthorFollowing = await relationshipModel.isFollowingBool(
    currentUser.id,
    user.id
  )
  const isMutualFollow = isFollowing && isAthorFollowing

  return { user, isFollowing, isMutualFollow }
}

/**
 * user create model
 */
const create = async (body: UserCreateApiReq) => {
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
