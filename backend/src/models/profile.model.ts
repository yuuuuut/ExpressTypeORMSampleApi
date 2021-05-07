import { EntityManager, getManager } from 'typeorm'

import { Profile, User } from '@/entities'

/**
 * @description Profileを作成します。
 * @param em TypeORM EntityManager
 */
const create = async (em: EntityManager) => {
  const profileData = em.create(Profile)
  return await em.save(profileData)
}

/**
 * @description ProfileをUpdateします。
 * @param currentUser User Entity
 * @param body ProfileUpdateApiReq
 */
const update = async (currentUserId: string, body: ProfileUpdateReq) => {
  const profileRepository = getManager().getRepository(Profile)
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  const profile = await profileRepository.findOne(currentUser.profile)
  if (!profile) {
    throw Object.assign(new Error('プロフィールが存在しません。'), { status: 404 })
  }

  profile.lineId = body.lineId || profile.lineId
  profile.twitterId = body.twitterId || profile.twitterId

  await profileRepository.save(profile)

  return profile
}

export { create, update }
