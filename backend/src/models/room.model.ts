import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Room, User } from '@/entities'
import { getUser } from './common.model'

/**
 * room model index
 */
const index = async (currentUserId: string) => {
  const currentUser = await getUser(currentUserId, ['rooms'])
  const rooms = currentUser.rooms

  return { rooms }
}

/**
 * room model show
 */
const show = async (roomId: string) => {
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId, {
    relations: ['users'],
  })
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  return { room }
}

/**
 * room model create
 */
const create = async (userId: string, currentUserId: string) => {
  const roomRepository = getManager().getRepository(Room)
  const uuid = uuidv4()

  const currentUser = await getUser(currentUserId)
  const user = await getUser(userId)

  const newRoom = new Room()
  newRoom.id = uuid
  newRoom.users = [user, currentUser]
  const room = await roomRepository.save(newRoom)

  return { room }
}

/**
 * Entry関係が存在するかどうかを返します。
 * @param otherUser User Entity
 * @param currentUser User Entity
 */
const isRoomBool = (otherUser: User, currentUser: User) => {
  let isRoom = false,
    roomId: string | undefined

  for (const ouRoom of otherUser.rooms) {
    for (const cuRoom of currentUser.rooms) {
      if (ouRoom.id === cuRoom.id) {
        isRoom = true
        roomId = cuRoom.id
        break
      }
    }
  }
  if (!isRoom) return { isRoom: false, roomId: undefined }

  return { isRoom, roomId }
}

export { index, show, create, isRoomBool }
