import {
  TestIResponse,
  UserCreateApiRes,
  UserShowApiRes,
} from '../../commons/types'
import { Req, createTestUser, deleteTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('User API Controller Test', () => {
  describe('Show Test', () => {
    it('GET /api/users/:id Userの取得ができること。', async () => {
      const user = await createFirebaseUser()

      const response = (await authCheckMock(
        `/users/${user.id}`,
        'GET'
      )) as TestIResponse<UserShowApiRes>

      await deleteTestUser(user.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.user).toEqual(user)
    })
    it('GET /api/users/:id Userが存在しない場合Userの取得ができないこと。', async () => {
      const response = (await authCheckMock(
        `/users/NotUser`,
        'GET'
      )) as TestIResponse<UserShowApiRes>

      expect(response.status).toEqual(404)
      expect(response.body.error?.message).toEqual('ユーザーが存在しません。')
    })
  })

  describe('Create Test', () => {
    it('POST /api/users Userの作成ができること。', async () => {
      const userData = {
        id: 'TestUser',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      const response = (await Req.post('/users').send(
        userData
      )) as TestIResponse<UserCreateApiRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.user).toEqual({ ...userData, isAdmin: false })
      expect(response.body.data.isCreate).toEqual(true)
      expect(response.body.data.profile?.user.id).toEqual(userData.id)
    })

    it('POST /api/users Userが存在する場合、Userの作成が行われないこと。', async () => {
      const user = await createTestUser()

      const newUser = {
        id: user.id,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }

      const response = (await Req.post('/users').send(
        newUser
      )) as TestIResponse<UserCreateApiRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.isCreate).toEqual(false)
    })
  })
})
