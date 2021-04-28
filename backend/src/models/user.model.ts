import { getManager } from 'typeorm'

import * as relationshipModel from './relationship.model'
import * as profileModel from './profile.model'
import { UserCreateApiReq } from '../types'
import { isRoomBool } from './entry.model'
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
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  if (user.id !== currentUser.id) {
    const isFollowing = await relationshipModel.isFollowingBool(userId, currentUser.id)
    const isMutualFollow = await relationshipModel.isMutualFollowBool(userId, currentUser.id)
    const { isRoom, roomId } = await isRoomBool(user.id, currentUser.id)

    return { user, isFollowing, isMutualFollow, isRoom, roomId }
  }

  return { user }
}

/**
 * user create model
 */
const create = async (body: UserCreateApiReq) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(body.id)
  if (!user) {
    const { user } = await getManager().transaction(async (em) => {
      const profile = await profileModel.create(em)
      const userData = em.create(User, {
        id: body.id,
        displayName: body.displayName,
        photoURL: body.photoURL,
        profile: profile,
      })

      const user = await em.save(userData)

      return { user }
    })

    return { user, isCreate: true }
  } else {
    return { user, isCreate: false }
  }
}

export { index, show, create }
