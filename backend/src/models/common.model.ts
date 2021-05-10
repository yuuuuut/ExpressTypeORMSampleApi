import { getManager } from 'typeorm'
import { Room, User } from '@/entities'

/**
 * Userを返します。
 * @param userId ユーザーのID
 * @param relations リレーションを示すstringの配列
 */
async function getUser(userId: string, relations?: string[]) {
  let currentUser: User | undefined

  const userRepository = getManager().getRepository(User)

  if (relations) {
    currentUser = await userRepository.findOne(userId, {
      relations: relations,
    })
  } else {
    currentUser = await userRepository.findOne(userId)
  }

  if (!currentUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return currentUser
}

/**
 * Roomを返します。
 * @param roomId ルームのID
 * @param relations リレーションを示すstringの配列
 */
async function getRoom(roomId: string, relations?: string[]) {
  let room: Room | undefined

  const roomRepository = getManager().getRepository(Room)

  if (relations) {
    room = await roomRepository.findOne(roomId, {
      relations: relations,
    })
  } else {
    room = await roomRepository.findOne(roomId)
  }

  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  return room
}

export { getUser, getRoom }
