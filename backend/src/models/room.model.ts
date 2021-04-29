import { getManager, SelectQueryBuilder } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'

import { Room, User } from '../entities'

/**
 * room index model
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
 * room show model
 */
const show = async (roomId: string, currentUser: User) => {
  const roomRepository = getManager().getRepository(Room)
  const room = await roomRepository.findOne(roomId, {
    relations: ['users'],
  })
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  return { room }
}

/**
 * room create model
 */
const create = async (userId: string, cu: User) => {
  const roomRepository = getManager().getRepository(Room)
  const userRepository = getManager().getRepository(User)
  const uuid = uuidv4()

  const user = await userRepository.findOne(userId)
  const currentUser = await userRepository.findOne(cu.id)
  if (!user || !currentUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  const newRoom = new Room()
  newRoom.id = uuid
  newRoom.users = [user, currentUser]
  const room = await roomRepository.save(newRoom)

  return { room }
}

/**
 * Entry関係が存在するかどうかを返す。
 */
const isRoomBool = async (userId: string, currentUserId: string) => {
  let isRoom: boolean, roomId: string | undefined

  const roomRepository = getManager().getRepository(Room)
  const room = await roomRepository.findOne({
    join: {
      alias: 'room',
      leftJoinAndSelect: {
        users: 'room.users',
      },
    },
    where: (qb: SelectQueryBuilder<Room>) => {
      qb.where('users.id = :id', { id: userId })
      qb.andWhere('users.id = :id', { id: currentUserId })
    },
  })

  if (!room) {
    isRoom = false
    roomId = undefined
  } else {
    isRoom = true
    roomId = room.id
  }

  return { isRoom, roomId }
}

export { index, show, create, isRoomBool }
