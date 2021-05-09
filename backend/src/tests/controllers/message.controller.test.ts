import {
  addProfileTestUser,
  createTestMessage,
  createTestProfile,
  createTestRoom,
  createTestUser,
} from '@/tests/common'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'

/***************************
 *    Main
 **************************/
describe('Message API Controller Test', () => {
  describe('GET /api/rooms/:id/messages', () => {
    it('Messagesの取得ができること', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await addProfileTestUser(testCurrentUser, testProfile)
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Response
      const response: TestIResponse<MessageIndexRes> = await authCheckMock(`/rooms/${testRoom.id}/messages`, 'GET')

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
              followers: [],
              followings: [],
              followersCount: '0',
              followingsCount: '0',
              rooms: [],
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
    it('複数のMessagesの取得ができること', async () => {
      // Create Test Data
      const testProfile1 = await createTestProfile()
      const testProfile2 = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser('TestUser')
      await addProfileTestUser(testCurrentUser, testProfile1)
      await addProfileTestUser(testUser, testProfile2)
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage1 = await createTestMessage(testCurrentUser, testRoom)
      const testMessage2 = await createTestMessage(testUser, testRoom)

      // Response
      const response: TestIResponse<MessageIndexRes> = await authCheckMock(`/rooms/${testRoom.id}/messages`, 'GET')

      // ExpectedJson Data
      const expectedJson = {
        messages: [
          {
            id: testMessage1.id,
            checked: testMessage1.checked,
            kind: testMessage1.kind,
            isApproval: testMessage1.isApproval,
            rejected: testMessage1.rejected,
            user: {
              id: testCurrentUser.id,
              displayName: testCurrentUser.displayName,
              photoURL: testCurrentUser.photoURL,
              isAdmin: testCurrentUser.isAdmin,
              followers: testCurrentUser.followers,
              followings: testCurrentUser.followings,
              followersCount: testCurrentUser.followersCount,
              followingsCount: testCurrentUser.followingsCount,
              rooms: [],
              profile: {
                id: expect.anything(),
                lineId: testProfile1.lineId,
                twitterId: testProfile1.twitterId,
              },
            },
          },
          {
            id: testMessage2.id,
            checked: testMessage2.checked,
            kind: testMessage2.kind,
            isApproval: testMessage2.isApproval,
            rejected: testMessage2.rejected,
            user: {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followers: testUser.followers,
              followings: testUser.followings,
              followersCount: testUser.followersCount,
              followingsCount: testUser.followingsCount,
              rooms: [],
              profile: {
                id: expect.anything(),
                lineId: testProfile2.lineId,
                twitterId: testProfile2.twitterId,
              },
            },
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })

  describe('POST /api/rooms/:id/messages', () => {
    it('Messageの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      // Test Data
      const data: MessageCreateReq = {
        kind: 'LINE',
      }

      // Response
      const response: TestIResponse<MessageCreateRes> = await authCheckMock(
        `/rooms/${testRoom.id}/messages`,
        'POST',
        data
      )

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
            followers: [],
            followings: [],
            followersCount: '0',
            followingsCount: '0',
            rooms: [],
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

  describe('PUT /api/messages/:id', () => {
    it('MessageのisApprovalをTrueにできること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Test Data
      const data: MessageUpdateReq = {
        type: 'IS_APPROVAL',
      }

      // Response
      const response: TestIResponse<MessageUpdateRes> = await authCheckMock(`/messages/${testMessage.id}`, 'PUT', data)

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
    it('MessageのrejectedをTrueにできること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      // Test Data
      const data: MessageUpdateReq = {
        type: 'REJECTED',
      }

      // Response
      const response: TestIResponse<MessageUpdateRes> = await authCheckMock(`/messages/${testMessage.id}`, 'PUT', data)

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
