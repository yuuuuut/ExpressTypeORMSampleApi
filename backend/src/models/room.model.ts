import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { getRoom, getUser } from './common.model'
import { Room, User } from '@/entities'

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
const show = async (roomId: string, currentUserId: string) => {
  const room = await getRoom(roomId, ['users'])

  isUserBelongstoRoom(room.users, currentUserId)

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

/**
 * Roomに所属しているUserかどうかをチェックする。
 * @param users Userの配列
 * @param currentUserId CurrentUserのID
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
