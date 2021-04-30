import { ProfileUpdateApiRes, TestIResponse } from '@/types'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { createTestProfile } from '@/tests/common'

/***************************
 *    Main
 **************************/
describe('Profile API Controller Test', () => {
  describe('Update Test', () => {
    it('PUT /api/profiles Profileの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      await createFirebaseUser(testProfile)

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

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles LINE_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      await createFirebaseUser(testProfile)

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
          twitterId: null,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })

    it('PUT /api/profiles Twitter_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      await createFirebaseUser(testProfile)

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
          lineId: null,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
