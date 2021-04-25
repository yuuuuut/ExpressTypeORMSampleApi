import { getManager } from 'typeorm'

import { Relationship, User } from '../entities'

/**
 * Relationship model create
 */
const create = async (id: string, currentUser: User) => {
  const relationshipRepository = getManager().getRepository(Relationship)
  const userRepository = getManager().getRepository(User)

  const followUser = await userRepository.findOne(id)
  if (!followUser)
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const relationship = new Relationship()
  relationship.user = currentUser
  relationship.follow = followUser

  await relationshipRepository.save(relationship)
}

/**
 * Relationship model destroy
 */
const destroy = async (id: string, currentUser: User) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const relatinoship = await relationshipRepository.findOne({
    where: { user: currentUser.id, follow: id },
  })
  if (!relatinoship)
    throw Object.assign(new Error('フォロー関係が存在しません。'), {
      status: 404,
    })

  await relationshipRepository.delete(relatinoship)
}

/**
 * Relationship関係が存在するかどうかを返す。
 */
const isFollowingBool = async (userId: string, currentUserId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const relationship = await relationshipRepository.findOne({
    where: { user: currentUserId, follow: userId },
  })

  return Boolean(relationship)
}

export { create, destroy, isFollowingBool }
