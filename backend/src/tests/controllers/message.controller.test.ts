import { MessageCreateApiReq, MessageCreateApiRes, MessageIndexApiRes, TestIResponse } from '../../types'
import { authCheckMock, createFirebaseUser } from '../firebase'
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(testCurrentUser, room)
      await createTestEntry(testUser, room)
      const message = await createTestMessage(testCurrentUser, room)

      // Response
      const response = (await authCheckMock(`/rooms/${room.id}/messages`, 'GET')) as TestIResponse<MessageIndexApiRes>

      // ExpectedJson Data
      const expectedJson = {
        messages: [
          {
            id: message.id,
            kind: message.kind,
            isApproval: message.isApproval,
            rejected: message.rejected,
            user: {
              id: testCurrentUser.id,
              displayName: testCurrentUser.displayName,
              photoURL: testCurrentUser.photoURL,
              isAdmin: testCurrentUser.isAdmin,
              followersCount: testCurrentUser.followersCount,
              followingsCount: testCurrentUser.followingsCount,
            },
          },
        ],
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)
      await deleteTestRoom(room.id)

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })

  describe('Create Test', () => {
    it('POST /api/rooms/:id/messages Messageの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(testCurrentUser, room)
      await createTestEntry(testUser, room)

      // Test Data
      const data = {
        kind: 'LINE',
      } as MessageCreateApiReq

      // Response
      const response = (await authCheckMock(
        `/rooms/${room.id}/messages`,
        'POST',
        data
      )) as TestIResponse<MessageCreateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        message: {
          id: expect.anything(),
          kind: data.kind,
          isApproval: false,
          rejected: false,
          user: {
            id: testCurrentUser.id,
            displayName: testCurrentUser.displayName,
            photoURL: testCurrentUser.photoURL,
            isAdmin: testCurrentUser.isAdmin,
            followingsCount: testCurrentUser.followingsCount,
            followersCount: testCurrentUser.followersCount,
          },
          room: {
            id: room.id,
          },
        },
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)
      await deleteTestRoom(room.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
