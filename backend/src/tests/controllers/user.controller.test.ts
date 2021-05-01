import { TestIResponse, UserCreateApiRes, UserShowApiRes } from '@/types'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { Req, createTestUser } from '@/tests/common'

/***************************
 *    Main
 **************************/
describe('User API Controller Test', () => {
  describe('Show Test', () => {
    it('GET /api/users/:id currentUserの取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      // Response
      const response = (await authCheckMock(`/users/${testCurrentUser.id}`, 'GET')) as TestIResponse<UserShowApiRes>

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testCurrentUser.id,
          displayName: testCurrentUser.displayName,
          photoURL: testCurrentUser.photoURL,
          isAdmin: testCurrentUser.isAdmin,
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('GET /api/users/:id 他人のUserが取得ができること。', async () => {
      // Create Test Data
      await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response = (await authCheckMock(`/users/${testUser.id}`, 'GET')) as TestIResponse<UserShowApiRes>

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
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('GET /api/users/:id Userが存在しない場合Userの取得ができないこと。', async () => {
      // Response
      const response = (await authCheckMock(`/users/NotUser`, 'GET')) as TestIResponse<UserShowApiRes>

      expect(response.status).toEqual(404)
      expect(response.body.error?.message).toEqual('ユーザーが存在しません。')
    })
  })

  describe('Create Test', () => {
    it('POST /api/users Userの作成ができること。', async () => {
      // Test Data
      const userData = {
        id: 'TestUser',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      // Response
      const response = (await Req.post('/users').send(userData)) as TestIResponse<UserCreateApiRes>

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

    it('POST /api/users Userが存在する場合、Userの作成が行われないこと。', async () => {
      // Create Test Data
      const testUser = await createTestUser()

      // Test Data
      const newUser = {
        id: testUser.id,
        displayName: testUser.displayName,
        photoURL: testUser.photoURL,
      }

      // Response
      const response = (await Req.post('/users').send(newUser)) as TestIResponse<UserCreateApiRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.isCreate).toEqual(false)
    })
  })
})
