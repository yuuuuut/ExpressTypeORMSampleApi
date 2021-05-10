import { getRepository } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { getOneRoom, getOneUser } from './common.model'
import { Room, User } from '@/entity'

const roomRepository = () => getRepository(Room)

/**
 * room model index
 */
const index = async (currentUserId: string) => {
  const currentUser = await getOneUser(currentUserId, { relations: ['rooms'] })
  const rooms = currentUser.rooms

  return { rooms }
}

/**
 * room model show
 */
const show = async (roomId: string, currentUserId: string) => {
  const room = await getOneRoom(roomId, { relations: ['users'] })

  isUserBelongstoRoom(room.users, currentUserId)

  return { room }
}

/**
 * room model create
 */
const create = async (userId: string, currentUserId: string) => {
  const uuid = uuidv4()

  const currentUser = await getOneUser(currentUserId)
  const user = await getOneUser(userId)

  const newRoom = new Room()
  newRoom.id = uuid
  newRoom.users = [user, currentUser]
  const room = await roomRepository().save(newRoom)

  return { room }
}

/**
 * Entry関係が存在するかどうかを返します。
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

/**
 * Roomに所属しているUserかどうかをチェックする。
 */
const isUserBelongstoRoom = (users: User[], currentUserId: string) => {
  for (const user of users) {
    if (user.id === currentUserId) {
      return
    }
  }
  throw Object.assign(new Error('許可されていない操作です。'), { status: 500 })
}

export { index, show, create, isRoomBool }

export const __local__ = {
  isUserBelongstoRoom,
}
