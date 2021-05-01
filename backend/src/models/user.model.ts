import { getManager } from 'typeorm'

import * as profileModel from '@/models/profile.model'
import * as roomModel from '@/models/room.model'

import { Relationship, User } from '@/entities'
import { UserCreateApiReq } from '@/types'

/**
 * @description ユーザーの配列を返します。
 */
const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find({})

  return users
}

/**
 * @description Userを返します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const show = async (userId: string, currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId)
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  if (user.id !== currentUserId) {
    const isFollowing = await isFollowingBool(user.id, currentUserId)
    const isMutualFollow = await isMutualFollowBool(user.id, currentUserId)
    const { isRoom, roomId } = await roomModel.isRoomBool(user.id, currentUserId)

    return { user, isFollowing, isMutualFollow, isRoom, roomId }
  }

  return { user }
}

/**
 * @description Userとそれに紐づくProfileを作成します。
 * @param body id | displayName | photoURL
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
 * @param userId UserのID。
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
 * @param userId UserのID。
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
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const follow = async (userId: string, currentUserId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  const otherUser = await userRepository.findOne(userId)
  if (!currentUser || !otherUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  if (currentUser.id === otherUser.id)
    throw Object.assign(new Error('自分をフォローすることはできません。'), { status: 500 })

  const relationship = new Relationship()
  relationship.followed = currentUser
  relationship.follower = otherUser

  return await relationshipRepository.save(relationship)
}

/**
 * @description フォロー関係を削除します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const unfollow = async (userId: string, currentUserId: string) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const relationship = await relationshipRepository.findOne({
    where: { followed: currentUserId, follower: userId },
  })

  if (!relationship)
    throw Object.assign(new Error('フォロー関係が存在しません。'), {
      status: 404,
    })

  return await relationshipRepository.delete(relationship)
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
