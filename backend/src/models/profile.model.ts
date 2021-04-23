import { EntityManager, getManager } from 'typeorm'

import { ProfileUpdateApiReq } from '../types'
import { Profile, User } from '../entities'

/**
 * profile model create
 */
const create = async (user: User, em: EntityManager) => {
  const profileData = em.create(Profile, {
    user: user,
  })

  const profile = await em.save(profileData)

  return profile
}

/**
 * profile model update
 */
const update = async (currentUser: User, body: ProfileUpdateApiReq) => {
  const profileRepository = getManager().getRepository(Profile)
  const profile = await profileRepository.findOne({
    where: { user: currentUser.id },
  })
  if (!profile)
    throw Object.assign(new Error('プロフィールが存在しません。'), {
      status: 404,
    })

  profile.lineId = body.lineId
  profile.twitterId = body.twitterId

  await profileRepository.save(profile)

  return profile
}

export { create, update }
