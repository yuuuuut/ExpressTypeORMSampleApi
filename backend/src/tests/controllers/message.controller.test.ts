import {
  MessageCreateApiReq,
  MessageCreateApiRes,
  TestIResponse,
} from '../../types'
import {
  createTestEntry,
  createTestRoom,
  createTestUser,
  deleteTestRoom,
  deleteTestUser,
} from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Message API Controller Test', () => {
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
