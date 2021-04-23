import { Request } from 'express'
import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import * as model from '../models/entry.model'
import { Room, User } from '../entities'

/**
 * room create model
 */
const create = async (req: Request) => {
  const userRepository = getManager().getRepository(User)
  const currentUserId = req.currentUserId
  const userId = req.params.id
  const uuid = uuidv4()

  const currentUser = await userRepository.findOne(currentUserId)
  const user = await userRepository.findOne(userId)
  if (!currentUser || !user)
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

export { create }
