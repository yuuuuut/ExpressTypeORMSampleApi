//import request from 'supertest'

import { TestIResponse, UserCreateApiRes } from '../../../commons/types'
import { ApiReq, deleteTestUser } from '../../common'

/***************************
 *
 **************************/

//const req = request('http://localhost:4000/api')

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
  })
})
