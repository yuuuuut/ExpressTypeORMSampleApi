import { ProfileUpdateApiRes, TestIResponse } from '../../types'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { createTestProfile, deleteTestUser } from '../common'

/***************************
 *    Main
 **************************/
describe('Profile API Controller Test', () => {
  describe('Update Test', () => {
    it('PUT /api/profiles Profileの更新に成功すること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const profile = await createTestProfile(testCurrentUser)

      // Test Data
      const data = {
        lineId: 'TestLineId',
        twitterId: 'TestTwitterId',
      }

      // Response
      const response = (await authCheckMock('/profiles', 'PUT', data)) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        profile: {
          id: profile.id,
          lineId: data.lineId,
          twitterId: data.twitterId,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles LINE_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const profile = await createTestProfile(testCurrentUser)

      // Test Data
      const data = {
        lineId: 'TestLineId',
      }

      // Response
      const response = (await authCheckMock('/profiles', 'PUT', data)) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        profile: {
          id: profile.id,
          lineId: data.lineId,
          twitterId: null,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles Twitter_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const profile = await createTestProfile(testCurrentUser)

      // Test Data
      const data = {
        twitterId: 'TestTwitterId',
      }

      // Response
      const response = (await authCheckMock('/profiles', 'PUT', data)) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        profile: {
          id: profile.id,
          lineId: null,
          twitterId: data.twitterId,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
