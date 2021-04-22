import { ProfileUpdateApiRes, TestIResponse } from '../../commons/types'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { createTestProfile, deleteTestUser } from '../common'

/***************************
 *    Main
 **************************/
describe('Profile API Controller Test', () => {
  describe('Update Test', () => {
    it('PUT /api/profiles Profileの更新に成功すること。', async () => {
      const user = await createFirebaseUser()
      const profile = await createTestProfile(user)

      const data = {
        lineId: 'TestLineId',
        twitterId: 'TestTwitterId',
      }

      const response = (await authCheckMock(
        '/profiles',
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateApiRes>

      await deleteTestUser(user.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.profile.lineId).toEqual(data.lineId)
      expect(response.body.data.profile.twitterId).toEqual(data.twitterId)
      expect(response.body.data.message).toEqual(
        'プロフィールの更新に成功しました。'
      )
    })

    it('PUT /api/profiles LINE_IDのみの更新に成功すること。', async () => {
      const user = await createFirebaseUser()
      const profile = await createTestProfile(user)

      const data = {
        lineId: 'TestLineId',
      }

      const response = (await authCheckMock(
        '/profiles',
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateApiRes>

      await deleteTestUser(user.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.profile.lineId).toEqual(data.lineId)
      expect(response.body.data.message).toEqual(
        'プロフィールの更新に成功しました。'
      )
    })

    it('PUT /api/profiles Twitter_IDのみの更新に成功すること。', async () => {
      const user = await createFirebaseUser()
      const profile = await createTestProfile(user)

      const data = {
        twitterId: 'TestTwitterId',
      }

      const response = (await authCheckMock(
        '/profiles',
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateApiRes>

      await deleteTestUser(user.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.profile.twitterId).toEqual(data.twitterId)
      expect(response.body.data.message).toEqual(
        'プロフィールの更新に成功しました。'
      )
    })
  })
})
