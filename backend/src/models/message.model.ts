import { getManager } from 'typeorm'

import { MessageCreateApiReq, MessageUpdateApiReq } from '../types'
import { Message, Room, User } from '../entities'

/**
 * message index model
 */
const index = async (roomId: string) => {
  const messageRepository = getManager().getRepository(Message)
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId)
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  const messages = await messageRepository.find({
    where: { room: roomId },
    join: {
      alias: 'message',
      leftJoinAndSelect: {
        user: 'message.user',
        profile: 'user.profile',
      },
    },
  })

  return { messages }
}

/**
 * message create model
 */
const create = async (body: MessageCreateApiReq, roomId: string, currentUser: User) => {
  const messageRepository = getManager().getRepository(Message)
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId)
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  const newMessage = new Message()
  newMessage.kind = body.kind
  newMessage.user = currentUser
  newMessage.room = room

  const message = await messageRepository.save(newMessage)

  return { message }
}

/**
 * message model update
 */
const update = async (messageId: string, body: MessageUpdateApiReq) => {
  const messageRepository = getManager().getRepository(Message)

  let message = await messageRepository.findOne(messageId)
  if (!message)
    throw Object.assign(new Error('メッセージが存在しません。'), {
      status: 404,
    })

  switch (body.type) {
    case 'IS_APPROVAL':
      message.isApproval = true
      message = await messageRepository.save(message)
      break
    case 'REJECTED':
      message.rejected = true
      message = await messageRepository.save(message)
      break
  }

  return message
}

export { index, create, update }
