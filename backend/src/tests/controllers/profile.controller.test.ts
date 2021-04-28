import { ProfileUpdateApiRes, TestIResponse } from '../../types'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { createTestProfile, deleteTestProfile, deleteTestUser } from '../common'

/***************************
 *    Main
 **************************/

/*
describe('Profile API Controller Test', () => {
  describe('Update Test', () => {
    it('PUT /api/profiles Profileの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser(testProfile)

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
          id: expect.anything(),
          lineId: data.lineId,
          twitterId: data.twitterId,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)
      await deleteTestProfile(testProfile.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles LINE_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser(testProfile)

      // Test Data
      const data = {
        lineId: 'TestLineId',
      }

      // Response
      const response = (await authCheckMock('/profiles', 'PUT', data)) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        profile: {
          id: expect.anything(),
          lineId: data.lineId,
          //twitterId: null,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)
      await deleteTestProfile(testProfile.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles Twitter_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser(testProfile)

      // Test Data
      const data = {
        twitterId: 'TestTwitterId',
      }

      // Response
      const response = (await authCheckMock('/profiles', 'PUT', data)) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson = {
        profile: {
          id: expect.anything(),
          twitterId: data.twitterId,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      // Delete Test Data
      await deleteTestUser(testCurrentUser.id)
      await deleteTestProfile(testProfile.id)

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})

*/
