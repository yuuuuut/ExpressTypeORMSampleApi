import { getManager } from 'typeorm'

import { Message, Room } from '@/entities'
import { getUser } from './common.model'

/**
 * Roomに所属するMessageの配列を返します。
 * @param roomId RoomのID。
 */
const index = async (roomId: string) => {
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId, {
    join: {
      alias: 'room',
      leftJoinAndSelect: {
        messages: 'room.messages',
        user: 'messages.user',
        profile: 'user.profile',
      },
    },
  })
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  const messages = room.messages

  return { messages }
}

/**
 * Messageを作成します。
 * @param body MessageCreateApiReq
 * @param roomId RoomのID。
 * @param currentUser User Entity
 */
const create = async (body: MessageCreateReq, roomId: string, currentUserId: string) => {
  const messageRepository = getManager().getRepository(Message)
  const roomRepository = getManager().getRepository(Room)

  const room = await roomRepository.findOne(roomId)
  if (!room) throw Object.assign(new Error('ルームが存在しません。'), { status: 404 })

  const currentUser = await getUser(currentUserId)

  const newMessage = new Message()
  newMessage.kind = body.kind
  newMessage.user = currentUser
  newMessage.room = room

  const message = await messageRepository.save(newMessage)

  return { message }
}

/**
 * Messageの状態をbody.typeによって変更します。
 * @param messageId MessageのID。
 * @param body MessageUpdateApiReq
 */
const update = async (body: MessageUpdateReq, messageId: string) => {
  const messageRepository = getManager().getRepository(Message)

  let message = await messageRepository.findOne(messageId)
  if (!message) {
    throw Object.assign(new Error('メッセージが存在しません。'), { status: 404 })
  }

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
