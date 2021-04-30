import { getManager, SelectQueryBuilder } from 'typeorm'

import * as profileModel from './profile.model'
import { UserCreateApiReq } from '../types'
import * as roomModel from './room.model'
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
    const isFollowing = await isFollowingBool(user.id, currentUser.id)
    const isMutualFollow = await isMutualFollowBool(user.id, currentUser.id)
    const { isRoom, roomId } = await roomModel.isRoomBool(user.id, currentUser.id)

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

/**
 * user model followings
 */
const followings = async (userId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['followings'],
  })
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const followings = user.followings

  return followings
}

/**
 * user model followers
 */
const followers = async (userId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['followers'],
  })
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  console.log(user)
  const followers = user.followers

  return followers
}

/**
 * user model follow
 */
const follow = async (userId: string, currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  const user = await userRepository.findOne(userId)
  if (!user || !currentUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  currentUser.followings = [user]

  await userRepository.save(currentUser)
}

/**
 * user model unfollow
 */
const unfollow = async (userId: string, currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  const user = await userRepository.findOne(userId)
  if (!user || !currentUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  await userRepository.createQueryBuilder('user').relation(User, 'followers').of(user).remove(currentUser)
}

/**
 *
 */
export const isFollowingBool = async (userId: string, currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.followings', 'followings')
    .where('user.id = :userId', { userId: currentUserId })
    .andWhere('followings.id = :followId', { followId: userId })
    .getCount()

  return Boolean(user)
}

/**
 *
 */
export const isMutualFollowBool = async (userId: string, currentUserId: string) => {
  const isFollowing = await isFollowingBool(userId, currentUserId)
  const isAthorFollowing = await isFollowingBool(currentUserId, userId)
  const isMutualFollow = isFollowing && isAthorFollowing

  return isMutualFollow
}

export { index, show, create, followings, followers, follow, unfollow }
