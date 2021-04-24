import { EntityManager, getManager, Not } from 'typeorm'

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

/**
 * Roomに所属するcurrentUserでないUserのEntryを取得する。
 */
const getOpponentUser = async (room: Room, currentUser: User) => {
  const entryRepository = getManager().getRepository(Entry)
  const entry = await entryRepository.findOne({
    where: { room: room, user: Not(currentUser.id) },
    relations: ['user'],
    select: ['id', 'user'],
  })
  if (!entry)
    throw Object.assign(new Error('相手が存在しません。'), { status: 404 })

  return entry
}

export { create, getOpponentUser }
