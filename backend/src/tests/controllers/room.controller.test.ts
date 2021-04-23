import { RoomCreateApiRes, TestIResponse } from '../../types'
import { createTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Room API Controller Test', () => {
  describe('Create Test', () => {
    it('POST /api/users/:id/rooms Roomの作成ができること。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()

      const response = (await authCheckMock(
        `/users/${user.id}/rooms`,
        'POST'
      )) as TestIResponse<RoomCreateApiRes>

      console.log(response)

      expect(response.status).toEqual(201)
    })
  })
})
