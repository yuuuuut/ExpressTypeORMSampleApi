import { EntityManager, getRepository } from 'typeorm'

import { getOneProfile, getOneUser } from './common.model'
import { Profile } from '@/entity'

const profileRepository = () => getRepository(Profile)

/**
 * profile model create
 */
const create = async (em: EntityManager) => {
  const profileData = em.create(Profile)

  return await em.save(profileData)
}

/**
 * profile model update
 */
const update = async (userId: string, body: ProfileUpdateReq) => {
  const currentUser = await getOneUser(userId)
  const profile = await getOneProfile(currentUser)

  profile.lineId = body.lineId || profile.lineId
  profile.twitterId = body.twitterId || profile.twitterId

  await profileRepository().save(profile)

  return profile
}

export { create, update }
