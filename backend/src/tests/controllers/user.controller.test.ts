import { TestIResponse, UserCreateApiRes } from '../../commons/types'
import { Req, createTestUser } from '../common'

/***************************
 *    Main
 **************************/
describe('User API Controller Test', () => {
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
