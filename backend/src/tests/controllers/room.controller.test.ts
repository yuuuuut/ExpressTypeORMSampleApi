import { RoomCreateApiRes, RoomShowApiRes, TestIResponse } from '@/types'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { createTestRoom, createTestUser } from '@/tests/common'

/***************************
 *    Main
 **************************/
describe('Room Controller Test', () => {
  describe('Show Test', () => {
    it('GET /api/rooms/:id Roomの取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      // Response
      const response = (await authCheckMock(`/rooms/${testRoom.id}`, 'GET')) as TestIResponse<RoomShowApiRes>

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
              followersCount: '0',
              followingsCount: '0',
            },
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followersCount: '0',
              followingsCount: '0',
            },
          ],
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
        room: {
          id: expect.anything(),
          users: [
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followersCount: '0',
              followingsCount: '0',
            },
            {
              id: testCurrentUser.id,
              displayName: testCurrentUser.displayName,
              photoURL: testCurrentUser.photoURL,
              isAdmin: testCurrentUser.isAdmin,
              followersCount: '0',
              followingsCount: '0',
            },
          ],
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
