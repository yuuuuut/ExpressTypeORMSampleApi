import { TestIResponse, UserCreateApiRes } from '../../../commons/types'
import { ApiReq, createTestUser, deleteTestUser } from '../../common'

/***************************
 *    Main
 **************************/
describe('User API Controller Test', () => {
  describe('Create Test', () => {
    it('POST /users Userの作成ができること。', async () => {
      const user = {
        id: 'Test',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      const response = (await ApiReq.post('/users').send(
        user
      )) as TestIResponse<UserCreateApiRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.user).toEqual({ ...user, isAdmin: false })
      expect(response.body.data.isCreate).toEqual(true)

      await deleteTestUser(user.id)
    })

    it('POST /users Userが存在する場合、Userの作成が行われないこと。', async () => {
      const user = await createTestUser()

      const newUser = {
        id: user.id,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }

      const response = (await ApiReq.post('/users').send(
        newUser
      )) as TestIResponse<UserCreateApiRes>

      expect(response.status).toEqual(201)
      expect(response.body.data.user).toEqual({ ...user, isAdmin: false })
      expect(response.body.data.isCreate).toEqual(false)

      await deleteTestUser(user.id)
    })
  })
})
