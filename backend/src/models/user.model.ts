import { getManager, SelectQueryBuilder } from 'typeorm'

import * as profileModel from './profile.model'
import { UserCreateApiReq } from '../types'
import * as roomModel from '@/models/room.model'
import { Relationship, User } from '../entities'

/**
 * @description ユーザーの配列を返します。
 */
const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find({})

  return users
}

/**
 * @description ユーザーを返します。
 */
const show = async (userId: string, currentUser: User) => {
  const userRepository = getManager().getRepository(User)
  const user = await userRepository.findOne(userId)
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  if (user.id !== currentUser.id) {
    const isFollowing = await isFollowingBool(user.id, currentUser.id)
    const isMutualFollow = await isMutualFollowBool(user.id, currentUser.id)
    const { isRoom, roomId } = await roomModel.isRoomBool(user.id, currentUser.id)

    return { user, isFollowing, isMutualFollow, isRoom, roomId }
  }

  return { user }
}

/**
 * @description Userを作成します。
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

/**
 * @description フォローしているユーザーの配列を返します。
 */
const followings = async (userId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['followings', 'followings.follower'],
  })
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return user.followings
}

/**
 * @description フォローされているユーザーの配列を返します。
 */
const followers = async (userId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['followers', 'followers.followed'],
  })
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return user.followers
}

/**
 * @description フォロー関係を作成します。
 */
const follow = async (userId: string, currentUser: User) => {
  const relationshipRepository = getManager().getRepository(Relationship)
  const userRepository = getManager().getRepository(User)

  const otherUser = await userRepository.findOne(userId)
  if (!otherUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const relationship = new Relationship()
  relationship.followed = currentUser
  relationship.follower = otherUser

  await relationshipRepository.save(relationship)
}

/**
 * @description フォロー関係を削除します。
 */
const unfollow = async (userId: string, currentUser: User) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const relationship = await relationshipRepository.findOne({
    where: { followed: currentUser.id, follower: userId },
  })

  if (!relationship)
    throw Object.assign(new Error('フォロー関係が存在しません。'), {
      status: 404,
    })

  await relationshipRepository.delete(relationship)
}

/**
 * @description フォロー関係が存在するかBooleanを返します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const isFollowingBool = async (userId: string, currentUserId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const relationship = await relationshipRepository.findOne({
    where: { followed: currentUserId, follower: userId },
  })

  return Boolean(relationship)
}

/**
 * @description 相互関係のフォローが存在するかBooleanを返します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const isMutualFollowBool = async (userId: string, currentUserId: string) => {
  const isFollowing = await isFollowingBool(userId, currentUserId)
  const isAthorFollowing = await isFollowingBool(currentUserId, userId)
  const isMutualFollow = isFollowing && isAthorFollowing

  return isMutualFollow
}

export { index, show, create, followings, followers, follow, unfollow }

export const __local__ = {
  isFollowingBool,
  isMutualFollowBool,
}
