import { getManager } from 'typeorm'

import * as profileModel from '@/models/profile.model'
import * as roomModel from '@/models/room.model'
import * as tagModel from '@/models/tag.model'
import * as types from '@/types'
import { User } from '@/entities'

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

  const currentUser = await userRepository.findOne(currentUserId, { relations: ['rooms'] })
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  const user = await userRepository.findOne(userId, { relations: ['rooms'] })
  if (!user) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  if (user.id !== currentUserId) {
    const isFollowing = await isFollowingBool(user.id, currentUserId)
    const isMutualFollow = await isMutualFollowBool(user.id, currentUserId)
    const { isRoom, roomId } = roomModel.isRoomBool(user, currentUser)

    return { user, isFollowing, isMutualFollow, isRoom, roomId }
  }

  return { user }
}

/**
 * @description Userとそれに紐づくProfileを作成します。
 * @param body id | displayName | photoURL
 */
const create = async (body: types.UserCreateApiReq) => {
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
 * UserをUpdateします。
 * @param currentUserId CurrentUserのID。
 * @param body UserUpdateReq
 */
const update = async (currentUserId: string, body: types.UserUpdateReq) => {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  if (!body.tagIds) return currentUser

  const tags = await tagModel.updateUserGetTags(body.tagIds)

  currentUser.tags = tags
  await currentUser.save()

  return currentUser
}

/**
 * @description フォローしているユーザーの配列を返します。
 * @param userId UserのID。
 */
const followings = async (userId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['followings'],
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
    relations: ['followers'],
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
  if (userId === currentUserId) {
    throw Object.assign(new Error('自分自身をフォローすることはできません。'), { status: 500 })
  }

  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)
  const isFollowing = await isFollowingBool(user.id, currentUser.id)
  if (isFollowing) {
    throw Object.assign(new Error('既にフォローしています。'), { status: 500 })
  }

  user.followers.push(currentUser)
  await user.save()
}

/**
 * @description フォロー関係を削除します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const unfollow = async (userId: string, currentUserId: string) => {
  if (userId === currentUserId) {
    throw Object.assign(new Error('自分自身のフォロー解除はできません。'), { status: 500 })
  }

  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)

  if (user.followers.some((u) => u.id === currentUser.id)) {
    user.followers = user.followers.filter((user) => {
      return user.id !== currentUser.id
    })
    await user.save()
  }
}

/**
 * @description followingsとfollowersの関係を持ったCurrentUserとUserを配列で返します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const getUserAndRelationships = async (userId: string, currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId, {
    relations: ['followings', 'followers'],
  })
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  const user = await userRepository.findOne(userId, {
    relations: ['followings', 'followers'],
  })
  if (!user) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  return [currentUser, user]
}

/**
 * @description フォロー関係が存在するかBooleanを返します。
 * @param userId UserのID。
 * @param currentUserId CurrentUserのID。
 */
const isFollowingBool = async (userId: string, currentUserId: string) => {
  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)

  if (user.followers.some((u) => u.id === currentUser.id)) {
    return true
  }
  return false
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

export { index, show, create, update, followings, followers, follow, unfollow }

export const __local__ = {
  getUserAndRelationships,
  isFollowingBool,
  isMutualFollowBool,
}
