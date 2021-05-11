import { getManager, getRepository } from 'typeorm'
import Redis from 'ioredis'

import { getOneUser } from '@/model/common.model'
import { User } from '@/entity'
import redis from '@/lib/redis'

import * as notificationModel from '@/model/notification.model'
import * as profileModel from '@/model/profile.model'
import * as roomModel from '@/model/room.model'
import * as tagModel from '@/model/tag.model'

const userRepository = () => getRepository(User)

/**
 * user model index
 */
const index = async () => {
  const users = await userRepository().find({})

  return users
}

/**
 * user model show
 */
const show = async (userId: string, currentUserId: string) => {
  const currentUser = await getOneUser(currentUserId, { relations: ['rooms'] })
  const user = await getOneUser(userId, { relations: ['rooms'] })

  if (userId !== currentUserId) {
    const isFollowing = await isFollowingBool(user.id, currentUserId)
    const isMutualFollow = await isMutualFollowBool(user.id, currentUserId)
    const { isRoom, roomId } = roomModel.isRoomBool(user, currentUser)

    return { user, isFollowing, isMutualFollow, isRoom, roomId }
  }

  return { user }
}

/**
 * user model create
 */
const create = async (body: UserCreateReq) => {
  const user = await userRepository().findOne(body.id)

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
 * user model update
 */
const update = async (userId: string, body: UserUpdateReq) => {
  const currentUser = await getOneUser(userId)

  if (!body.tagIds) return currentUser

  const tags = await tagModel.updateUserGetTags(body.tagIds)

  currentUser.tags = tags
  await currentUser.save()

  return currentUser
}

/**
 * フォローしているユーザーの配列を返します。
 * @param userId UserのID
 */
const followings = async (userId: string) => {
  const user = await getOneUser(userId, { relations: ['followings'] })

  return user.followings
}

/**
 * フォローされているユーザーの配列を返します。
 * @param userId UserのID
 */
const followers = async (userId: string) => {
  const user = await getOneUser(userId, { relations: ['followers'] })

  return user.followers
}

/**
 * フォロー関係を作成します。
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const follow = async (userId: string, currentUserId: string) => {
  await checkTodayFollowCount(redis, userId, currentUserId)

  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)
  const isFollowing = await isFollowingBool(user.id, currentUser.id)
  if (isFollowing) {
    throw Object.assign(new Error('既にフォローしています。'), { status: 500 })
  }

  const notification = await getManager().transaction(async (entityManager) => {
    user.followers.push(currentUser)

    await entityManager.save(user)
    const notification = await notificationModel.create(currentUser, user, 'FOLLOW', entityManager)

    return notification
  })

  return { notification }
}

/**
 * フォロー関係を削除します。
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const unfollow = async (userId: string, currentUserId: string) => {
  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)

  if (user.followers.some((u) => u.id === currentUser.id)) {
    user.followers = user.followers.filter((user) => {
      return user.id !== currentUser.id
    })
    await user.save()
  }
}

/**
 * followingsとfollowersの関係を持ったCurrentUserとUserを配列で返します。
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const getUserAndRelationships = async (userId: string, currentUserId: string) => {
  const currentUser = await getOneUser(currentUserId, { relations: ['followings', 'followers'] })
  const user = await getOneUser(userId, { relations: ['followings', 'followers'] })

  return [currentUser, user]
}

/**
 * フォロー関係が存在するかBooleanを返します。
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const isFollowingBool = async (userId: string, currentUserId: string) => {
  const [currentUser, user] = await getUserAndRelationships(userId, currentUserId)

  if (user.followers.some((u) => u.id === currentUser.id)) {
    return true
  }
  return false
}

/**
 * 相互関係のフォローが存在するかBooleanを返します。
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const isMutualFollowBool = async (userId: string, currentUserId: string) => {
  const isFollowing = await isFollowingBool(userId, currentUserId)
  const isAthorFollowing = await isFollowingBool(currentUserId, userId)
  const isMutualFollow = isFollowing && isAthorFollowing

  return isMutualFollow
}

/**
 * 一日の中で、異なるユーザー6人目をフォローしようとした際に、Errorを発生させる。
 * @param redis Redis
 * @param userId UserのID
 * @param currentUserId CurrentUserのID
 */
const checkTodayFollowCount = async (redis: Redis.Redis, userId: string, currentUserId: string) => {
  const redisFollowIds = await redis.lrange(`follow-${currentUserId}`, 0, -1)
  const redisFollowIdsLen = await redis.llen(`follow-${currentUserId}`)

  if (!redisFollowIds.includes(userId)) {
    if (redisFollowIdsLen > 4) {
      throw Object.assign(new Error('今日のフォロー上限に達しました。'), { status: 500 })
    }
    await redis.pipeline().lpush(`follow-${currentUserId}`, userId).expire(`follow-${currentUserId}`, 60).exec()
  }
  const newRedisFollowIds = await redis.lrange(`follow-${currentUserId}`, 0, -1)

  return newRedisFollowIds
}

export { index, show, create, update, followings, followers, follow, unfollow }

export const __local__ = {
  getUserAndRelationships,
  isFollowingBool,
  isMutualFollowBool,
  checkTodayFollowCount,
}
