import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { Req, createTestUser, createTestTag } from '@/tests/common'

/***************************
 *    Main
 **************************/
describe('User API Controller Test', () => {
  describe('GET /api/users/:id', () => {
    it('currentUserの取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      // Response
      const response = (await authCheckMock(`/users/${testCurrentUser.id}`, 'GET')) as TestIResponse<UserShowRes>

      // ExpectedJson Data
      const expectedJson = {
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
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('他人のUserが取得ができること。', async () => {
      // Create Test Data
      await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response = (await authCheckMock(`/users/${testUser.id}`, 'GET')) as TestIResponse<UserShowRes>

      // ExpectedJson Data
      const expectedJson = {
        isFollowing: false,
        isMutualFollow: false,
        isRoom: false,
        user: {
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
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('Userが存在しない場合Userの取得ができないこと。', async () => {
      // Response
      const response = (await authCheckMock(`/users/NotUser`, 'GET')) as TestIResponse<UserShowRes>

      expect(response.status).toEqual(404)
      expect(response.body.error?.message).toEqual('ユーザーが存在しません。')
    })
  })

  describe('POST /api/users', () => {
    it('Userの作成ができること。', async () => {
      // Test Data
      const userData = {
        id: 'TestUser',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      // Response
      const response = (await Req.post('/users').send(userData)) as TestIResponse<UserCreateRes>

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: userData.id,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          isAdmin: false,
          profile: {
            id: expect.anything(),
            lineId: null,
            twitterId: null,
          },
        },
        isCreate: true,
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('Userが存在する場合、Userの作成が行われないこと。', async () => {
      // Create Test Data
      const testUser = await createTestUser()

      // Test Data
      const newUser = {
        id: testUser.id,
        displayName: testUser.displayName,
        photoURL: testUser.photoURL,
      }

      // Response
      const response = (await Req.post('/users').send(newUser)) as TestIResponse<UserCreateRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.isCreate).toEqual(false)
    })
  })

  describe('PUT /api/users/:id', () => {
    it('Userの更新ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const tag1 = await createTestTag('ゲーム')
      const tag2 = await createTestTag('読書')

      // Test Data
      const data = {
        tagIds: [tag1.id, tag2.id],
      } as UserUpdateReq

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<UserUpdateRes>

      // ExpectedJson Data
      const expectedJson = {
        user: {
          ...testCurrentUser,
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
          tags: [
            {
              id: tag1.id,
              name: tag1.name,
            },
            {
              id: tag2.id,
              name: tag2.name,
            },
          ],
        },
        message: 'Userを更新しました。',
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('CurrentUserでないと更新ができないこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response = (await authCheckMock(`/users/${testUser.id}`, 'PUT', {})) as TestIResponse<UserUpdateRes>

      console.log(response)

      expect(response.status).toEqual(403)
      expect(response.body.error?.message).toEqual('権限のないユーザーです。')
    })
    it('Userの更新後に更新しても値が変わらないこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const tag1 = await createTestTag('ゲーム')
      const tag2 = await createTestTag('読書')

      // Test Data
      const data = {
        tagIds: [tag1.id, tag2.id],
      } as UserUpdateReq

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<UserUpdateRes>

      // ExpectedJson Data
      const expectedJson = {
        user: {
          ...testCurrentUser,
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
          tags: [
            {
              id: tag1.id,
              name: tag1.name,
            },
            {
              id: tag2.id,
              name: tag2.name,
            },
          ],
        },
        message: 'Userを更新しました。',
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)

      // Response
      const response2 = (await authCheckMock(`/users/${testCurrentUser.id}`, 'PUT', {})) as TestIResponse<UserUpdateRes>

      // ExpectedJson Data
      const expectedJson2 = {
        user: {
          ...testCurrentUser,
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
        },
        message: 'Userを更新しました。',
      }

      expect(response2.status).toEqual(201)
      expect(response2.body.data).toEqual(expectedJson2)
    })
  })
})
