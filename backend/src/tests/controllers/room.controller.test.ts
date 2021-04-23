import { RoomCreateApiRes, RoomShowApiRes, TestIResponse } from '../../types'
import { createTestRoom, createTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Room API Controller Test', () => {
  describe('Show Test', () => {
    it('GET /api/rooms/:id Roomの取得ができること。', async () => {
      const room = await createTestRoom()

      const response = (await authCheckMock(
        `/rooms/${room.id}`,
        'GET'
      )) as TestIResponse<RoomShowApiRes>

      console.log(response)

      expect(response.status).toEqual(200)
    })
    it('GET /api/rooms/:id Roomが存在しない場合取得ができないこと。', async () => {
      const response = (await authCheckMock(
        `/rooms/NotRoom`,
        'GET'
      )) as TestIResponse<RoomShowApiRes>

      expect(response.status).toEqual(404)
    })
  })

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
