import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Room } from '../entities'

/**
 * room create model
 */
const create = async () => {
  const roomRepository = getManager().getRepository(Room)
  const uuid = uuidv4()

  const newRoom = new Room()
  newRoom.id = uuid

  const room = await roomRepository.save(newRoom)

  return { room }
}

export { create }
