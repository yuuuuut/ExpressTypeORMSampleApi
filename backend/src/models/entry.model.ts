import { EntityManager } from 'typeorm'

import { Entry, Room, User } from '../entities'

/**
 * entry create model
 */
const create = async (em: EntityManager, room: Room, user: User) => {
  const newEntry = em.create(Entry, {
    room: room,
    user: user,
  })
  const entry = await em.save(newEntry)

  return entry
}

export { create }
