import { EntityManager } from 'typeorm'
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

export { create }
