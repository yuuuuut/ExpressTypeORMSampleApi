import { EntityManager, getManager, Not } from 'typeorm'

import { Entry, Room, User } from '../entities'

/**
 * entry show model
 *
 */
const show = async (userId: string) => {
  const entryRepository = getManager().getRepository(Entry)

  const entry = await entryRepository.findOne({
    where: { user: userId },
    relations: ['room'],
  })
  if (!entry) return undefined

  return entry
}

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
 * Entry関係が存在するかどうかを返す。
 */
const isRoomBool = async (userId: string, currentUserId: string) => {
  let isRoom: boolean
  let roomId: string | undefined

  const currentUserEntry = await show(currentUserId)
  const userEntry = await show(userId)
  if (!currentUserEntry || !userEntry || currentUserEntry.room.id !== userEntry.room.id) {
    isRoom = false
    roomId = undefined
  } else {
    isRoom = true
    roomId = currentUserEntry.room.id
  }

  return { isRoom, roomId }
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
  if (!entry) throw Object.assign(new Error('相手が存在しません。'), { status: 404 })

  return entry
}

export { show, create, isRoomBool, getOpponentUser }
