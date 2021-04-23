import { RoomCreateApiRes, RoomShowApiRes, TestIResponse } from '../../types'
import {
  createTestRoom,
  createTestUser,
  deleteTestRoom,
  deleteTestUser,
} from '../common'
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

      await deleteTestRoom(room.id)

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

      await deleteTestUser(currentUser.id)
      await deleteTestRoom(response.body.data.room.id)

      expect(response.status).toEqual(201)
    })
  })
})
