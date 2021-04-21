import { Request } from 'express'
import { EntityManager, getManager } from 'typeorm'

import { Profile, User } from '../entities'

/**
 *
 */
const create = async (user: User, em: EntityManager) => {
  const profileData = em.create(Profile, {
    user: user,
  })

  const profile = await em.save(profileData)

  return profile
}

/**
 *
 */
const update = async (req: Request, userId: string) => {
  const profileRepository = getManager().getRepository(Profile)
  const profile = await profileRepository.findOne({
    where: { user: userId },
  })
  if (!profile) throw new Error('プロフィールが存在しません。')

  const body = (req.body as unknown) as Pick<Profile, 'lineId' | 'twitterId'>
  profile.lineId = body.lineId
  profile.twitterId = body.twitterId

  await profileRepository.save(profile)

  return profile
}

export { create, update }
