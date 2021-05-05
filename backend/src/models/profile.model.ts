import { EntityManager, getManager } from 'typeorm'

import { ProfileUpdateApiReq } from '@/types'
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
 * @param body lineId | twitterId
 */
const update = async (currentUser: User, body: ProfileUpdateApiReq) => {
  const profileRepository = getManager().getRepository(Profile)

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
