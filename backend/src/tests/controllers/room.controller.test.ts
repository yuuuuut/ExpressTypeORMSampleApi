import { RoomCreateApiRes, RoomShowApiRes, TestIResponse } from '../../types'
import { createTestEntry, createTestRoom, createTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Room Controller Test', () => {
  describe('Show Test', () => {
    it('GET /api/rooms/:id Roomの取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(testCurrentUser, room)
      await createTestEntry(testUser, room)

      // Response
      const response = (await authCheckMock(`/rooms/${room.id}`, 'GET')) as TestIResponse<RoomShowApiRes>

      // ExpectedJson Data
      const expectedJson = {
        room: {
          id: room.id,
        },
        otherEntry: {
          id: expect.anything(),
          user: {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
            followingsCount: testUser.followingsCount,
            followersCount: testUser.followersCount,
          },
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('GET /api/rooms/:id Roomが存在しない場合取得ができないこと。', async () => {
      // Response
      const response = (await authCheckMock(`/rooms/NotRoom`, 'GET')) as TestIResponse<RoomShowApiRes>

      expect(response.status).toEqual(404)
    })
  })

  describe('Create Test', () => {
    it('POST /api/users/:id/rooms Roomの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response = (await authCheckMock(`/users/${testUser.id}/rooms`, 'POST')) as TestIResponse<RoomCreateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        currentUserEntry: {
          user: {
            id: testCurrentUser.id,
            displayName: testCurrentUser.displayName,
            photoURL: testCurrentUser.photoURL,
            isAdmin: testCurrentUser.isAdmin,
          },
        },
        userEntry: {
          user: {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
          },
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data.currentUserEntry.user).toEqual(expectedJson.currentUserEntry.user)
      expect(response.body.data.userEntry.user).toEqual(expectedJson.userEntry.user)
    })
  })
})
