import {
  MessageCreateApiReq,
  MessageCreateApiRes,
  MessageIndexApiRes,
  MessageUpdateApiReq,
  MessageUpdateApiRes,
  TestIResponse,
} from '../../types'

import { createTestEntry, createTestMessage, createTestProfile, createTestRoom, createTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Message API Controller Test', () => {
  describe('Index Test', () => {
    it('GET /api/rooms/:id/messages Messagesの取得ができること', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser(testProfile)
      const testUser = await createTestUser()
      const testRoom = await createTestRoom()
      await createTestEntry(testCurrentUser, testRoom)
      await createTestEntry(testUser, testRoom)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Response
      const response = (await authCheckMock(
        `/rooms/${testRoom.id}/messages`,
        'GET'
      )) as TestIResponse<MessageIndexApiRes>

      // ExpectedJson Data
      const expectedJson = {
        messages: [
          {
            id: testMessage.id,
            checked: testMessage.checked,
            kind: testMessage.kind,
            isApproval: testMessage.isApproval,
            rejected: testMessage.rejected,
            user: {
              id: testCurrentUser.id,
              displayName: testCurrentUser.displayName,
              photoURL: testCurrentUser.photoURL,
              isAdmin: testCurrentUser.isAdmin,
              followersCount: testCurrentUser.followersCount,
              followingsCount: testCurrentUser.followingsCount,
              profile: {
                id: expect.anything(),
                lineId: testProfile.lineId,
                twitterId: testProfile.twitterId,
              },
            },
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })

  describe('Create Test', () => {
    it('POST /api/rooms/:id/messages Messageの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom()
      await createTestEntry(testCurrentUser, testRoom)
      await createTestEntry(testUser, testRoom)

      // Test Data
      const data = {
        kind: 'LINE',
      } as MessageCreateApiReq

      // Response
      const response = (await authCheckMock(
        `/rooms/${testRoom.id}/messages`,
        'POST',
        data
      )) as TestIResponse<MessageCreateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        message: {
          id: expect.anything(),
          checked: false,
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
            id: testRoom.id,
          },
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })

  describe('Update Test', () => {
    it('PUT /api/messages/:id MessageのisApprovalをTrueにできること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testRoom = await createTestRoom()
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Test Data
      const data = {
        type: 'IS_APPROVAL',
      } as MessageUpdateApiReq

      // Response
      const response = (await authCheckMock(
        `/messages/${testMessage.id}`,
        'PUT',
        data
      )) as TestIResponse<MessageUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        message: {
          id: testMessage.id,
          checked: testMessage.checked,
          kind: testMessage.kind,
          isApproval: true,
          rejected: testMessage.rejected,
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('PUT /api/messages/:id MessageのrejectedをTrueにできること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testRoom = await createTestRoom()
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Test Data
      const data = {
        type: 'REJECTED',
      } as MessageUpdateApiReq

      // Response
      const response = (await authCheckMock(
        `/messages/${testMessage.id}`,
        'PUT',
        data
      )) as TestIResponse<MessageUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        message: {
          id: testMessage.id,
          checked: testMessage.checked,
          kind: testMessage.kind,
          isApproval: testMessage.isApproval,
          rejected: true,
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
