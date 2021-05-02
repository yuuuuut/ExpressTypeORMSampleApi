import { getManager } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Room, User } from '@/entities'

/**
 * @description ユーザーに紐づくRoomの配列を返します。
 * @param currentUser CurrentUser Entity
 */
const index = async (currentUser: User) => {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(currentUser.id, {
    relations: ['rooms'],
  })
  if (!user) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const rooms = user.rooms

  return { rooms }
}

/**
 * @description Roomを返します。
 * @param roomId RoomのID。
 * @param currentUser CurrentUser Entity
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
 * @description Roomを作成します。
 * @param userId UserのID。
 * @param currentUserId CurentUserのID。
 */
const create = async (userId: string, currentUserId: string) => {
  const roomRepository = getManager().getRepository(Room)
  const userRepository = getManager().getRepository(User)
  const uuid = uuidv4()

  const user = await userRepository.findOne(userId)
  if (!user) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  const currentUser = await userRepository.findOne(currentUserId)
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  const newRoom = new Room()
  newRoom.id = uuid
  newRoom.users = [user, currentUser]
  const room = await roomRepository.save(newRoom)

  return { room }
}

/**
 * @description Entry関係が存在するかどうかを返します。
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
