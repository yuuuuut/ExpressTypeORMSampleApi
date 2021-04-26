import { getManager } from 'typeorm'

import { Relationship, User } from '../entities'

/**
 * Relationship model followings
 */
const followings = async (userId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const followings = await relationshipRepository.find({
    where: { user: userId },
    relations: ['follow'],
  })

  return followings
}

/**
 * Relationship model followers
 */
const followers = async (userId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const followers = await relationshipRepository.find({
    where: { follow: userId },
    relations: ['user'],
  })

  return followers
}

/**
 * Relationship model create
 */
const create = async (id: string, currentUser: User) => {
  const relationshipRepository = getManager().getRepository(Relationship)
  const userRepository = getManager().getRepository(User)

  const followUser = await userRepository.findOne(id)
  if (!followUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

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

/**
 * 相互フォローかどうかを返す。
 */
const isMutualFollowBool = async (userId: string, currentUserId: string) => {
  const isFollowing = await isFollowingBool(userId, currentUserId)
  const isAthorFollowing = await isFollowingBool(currentUserId, userId)
  const isMutualFollow = isFollowing && isAthorFollowing

  return isMutualFollow
}

export { followings, followers, create, destroy, isFollowingBool, isMutualFollowBool }
