import { EntityManager, getManager } from 'typeorm'

import { Profile } from '@/entities'
import { getUser } from './common.model'

/**
 * Profileを作成します。
 * @param em TypeORM EntityManager
 */
const create = async (em: EntityManager) => {
  const profileData = em.create(Profile)
  return await em.save(profileData)
}

/**
 * ProfileをUpdateします。
 * @param currentUser User Entity
 * @param body ProfileUpdateApiReq
 */
const update = async (userId: string, body: ProfileUpdateReq) => {
  const profileRepository = getManager().getRepository(Profile)

  const currentUser = await getUser(userId)

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
