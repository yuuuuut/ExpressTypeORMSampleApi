import { RoomCreateApiRes, TestIResponse } from '../../types'
import { authCheckMock } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Room API Controller Test', () => {
  describe('Create Test', () => {
    it('POST /api/rooms Roomの作成ができること。', async () => {
      const response = (await authCheckMock(
        '/rooms',
        'POST'
      )) as TestIResponse<RoomCreateApiRes>

      expect(response.status).toEqual(201)
    })
  })
})
