import { getManager } from 'typeorm'

import { Message, Room, User } from '../entities'
import { MessageCreateApiReq } from '../types'

/**
 * message create model
 */
const create = async (
  body: MessageCreateApiReq,
  roomId: string,
  currentUser: User
) => {
  const messageRepository = getManager().getRepository(Message)
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId)
  if (!room)
    throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  const newMessage = new Message()
  newMessage.kind = body.kind
  newMessage.user = currentUser
  newMessage.room = room

  const message = await messageRepository.save(newMessage)

  return { message }
}

export { create }
