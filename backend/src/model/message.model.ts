import { getRepository } from 'typeorm'

import { getOneMessage, getOneRoom, getOneUser } from './common.model'
import { Message } from '@/entity'

const messageRepository = () => getRepository(Message)

/**
 * message model index
 */
const index = async (roomId: string) => {
  const room = await getOneRoom(roomId, {
    join: {
      alias: 'room',
      leftJoinAndSelect: {
        messages: 'room.messages',
        user: 'messages.user',
        profile: 'user.profile',
      },
    },
  })

  const messages = room.messages

  return { messages }
}

/**
 * message model create
 */
const create = async (body: MessageCreateReq, roomId: string, currentUserId: string) => {
  const room = await getOneRoom(roomId)
  const currentUser = await getOneUser(currentUserId)

  const newMessage = new Message()
  newMessage.kind = body.kind
  newMessage.user = currentUser
  newMessage.room = room
  const message = await messageRepository().save(newMessage)

  return { message }
}

/**
 * message model update
 */
const update = async (body: MessageUpdateReq, messageId: string) => {
  let message = await getOneMessage(messageId)

  switch (body.type) {
    case 'IS_APPROVAL':
      message.isApproval = true
      message = await messageRepository().save(message)
      break
    case 'REJECTED':
      message.rejected = true
      message = await messageRepository().save(message)
      break
  }

  return message
}

export { index, create, update }
