import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import * as model from '../models/entry.model'
import { Room, User } from '../entities'

/**
 * room show model
 */
const show = async (id: string) => {
  const roomRepository = getManager().getRepository(Room)
  const room = await roomRepository.findOne(id)
  if (!room)
    throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  return { room }
}

/**
 * room create model
 */
const create = async (userId: string, currentUser: User) => {
  const userRepository = getManager().getRepository(User)
  const uuid = uuidv4()

  const user = await userRepository.findOne(userId)
  if (!user)
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const data = await getManager().transaction(async (em) => {
    const newRoom = em.create(Room, {
      id: uuid,
    })
    const room = await em.save(newRoom)

    const currentUserEntry = await model.create(em, room, currentUser)
    const userEntry = await model.create(em, room, user)

    return { room, currentUserEntry, userEntry }
  })

  return {
    room: data.room,
    currentUserEntry: data.currentUserEntry,
    userEntry: data.userEntry,
  }
}

export { show, create }
