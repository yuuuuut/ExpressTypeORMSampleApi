import { createTestUser, createFirebaseUser, authCheckMock, createTestRoom } from '@/test/common'

/***************************
 *    Main
 **************************/
describe('Room Controller Test', () => {
  describe('GET /api/rooms/:id', () => {
    it('Roomの取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const response: TestIResponse<RoomShowRes> = await authCheckMock(`/rooms/${testRoom.id}`, 'GET')

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
    it('Roomに所属していないユーザーの場合Errorが発生すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testRoom = await createTestRoom(testUser1, testUser2)

      const response: TestIResponse<RoomShowRes> = await authCheckMock(`/rooms/${testRoom.id}`, 'GET')

      expect(response.status).toEqual(500)
      expect(response.body.error?.message).toEqual('許可されていない操作です。')
    })
    it('Roomが存在しない場合取得ができないこと。', async () => {
      const response: TestIResponse<RoomShowRes> = await authCheckMock(`/rooms/NotRoom`, 'GET')

      expect(response.status).toEqual(404)
    })
  })

  describe('POST /api/users/:id/rooms', () => {
    it('Roomの作成ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const response: TestIResponse<RoomCreateRes> = await authCheckMock(`/users/${testUser.id}/rooms`, 'POST')

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
