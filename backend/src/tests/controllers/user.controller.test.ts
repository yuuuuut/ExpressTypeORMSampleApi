import { TestIResponse, UserCreateApiRes, UserShowApiRes } from '../../types'
import { Req, createTestUser, deleteTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

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
          followersCount: testCurrentUser.followersCount,
          followingsCount: testCurrentUser.followingsCount,
        },
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('GET /api/users/:id 他人のUserが取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
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
          followersCount: testUser.followersCount,
          followingsCount: testUser.followingsCount,
        },
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)

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

      expect(response.status).toEqual(201)
      expect(response.body.data.user).toEqual({ ...userData, isAdmin: false })
      expect(response.body.data.isCreate).toEqual(true)
      expect(response.body.data.profile?.user.id).toEqual(userData.id)
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
