import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { createTestRoom, createTestUser } from '@/tests/common'

/***************************
 *    Main
 **************************/
describe('Room Controller Test', () => {
  describe('GET /api/rooms/:id', () => {
    it('Roomの取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      // Response
      const response: TestIResponse<RoomShowRes> = await authCheckMock(`/rooms/${testRoom.id}`, 'GET')

      // ExpectedJson Data
      const expectedJson = {
        room: {
          id: testRoom.id,
          users: [
            {
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
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followers: [],
              followings: [],
              followersCount: '0',
              followingsCount: '0',
              rooms: [],
            },
          ],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('Roomが存在しない場合取得ができないこと。', async () => {
      // Response
      const response: TestIResponse<RoomShowRes> = await authCheckMock(`/rooms/NotRoom`, 'GET')

      expect(response.status).toEqual(404)
    })
  })

  describe('POST /api/users/:id/rooms', () => {
    it('Roomの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response: TestIResponse<RoomCreateRes> = await authCheckMock(`/users/${testUser.id}/rooms`, 'POST')

      // ExpectedJson Data
      const expectedJson = {
        room: {
          id: expect.anything(),
          users: [
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followers: [],
              followings: [],
              followersCount: '0',
              followingsCount: '0',
              rooms: [],
            },
            {
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
          ],
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
