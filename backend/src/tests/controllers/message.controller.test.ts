import { authCheckMock, createFirebaseUser } from '../firebase'
import {
  MessageCreateApiReq,
  MessageCreateApiRes,
  MessageIndexApiRes,
  TestIResponse,
} from '../../types'
import {
  createTestEntry,
  createTestMessage,
  createTestRoom,
  createTestUser,
  deleteTestRoom,
  deleteTestUser,
} from '../common'

/***************************
 *    Main
 **************************/
describe('Message API Controller Test', () => {
  describe('Index Test', () => {
    it('GET /api/rooms/:id/messages Messagesの取得ができること', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(currentUser, room)
      await createTestEntry(user, room)
      const message = await createTestMessage(currentUser, room)

      const response = (await authCheckMock(
        `/rooms/${room.id}/messages`,
        'GET'
      )) as TestIResponse<MessageIndexApiRes>

      await deleteTestUser(currentUser.id)
      await deleteTestRoom(room.id)

      console.log(response)
      expect(response.status).toEqual(200)
      expect(response.body.data.messages[0].id).toEqual(message.id)
      expect(response.body.data.messages[0].user).toEqual(currentUser)
    })
  })

  describe('Create Test', () => {
    it('POST /api/rooms/:id/messages Messageの作成ができること。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(currentUser, room)
      await createTestEntry(user, room)

      const data = {
        kind: 'LINE',
      } as MessageCreateApiReq

      const response = (await authCheckMock(
        `/rooms/${room.id}/messages`,
        'POST',
        data
      )) as TestIResponse<MessageCreateApiRes>

      await deleteTestUser(currentUser.id)
      await deleteTestRoom(room.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.message.kind).toEqual(data.kind)
      expect(response.body.data.message.room).toEqual(room)
      expect(response.body.data.message.user).toEqual(currentUser)
    })
  })
})
