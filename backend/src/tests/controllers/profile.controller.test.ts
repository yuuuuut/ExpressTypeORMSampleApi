import { ProfileUpdateApiRes, TestIResponse } from '@/types'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { addProfileTestUser, createTestProfile } from '@/tests/common'

/***************************
 *   Main
 **************************/
describe('Profile API Controller Test', () => {
  describe('PUT /api/profiles', () => {
    it('Profileの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

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

    it('Bodyが空だった場合はProfileを現在のままにすること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

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

      // Response
      const response2 = (await authCheckMock('/profiles', 'PUT', {})) as TestIResponse<ProfileUpdateApiRes>

      // ExpectedJson Data
      const expectedJson2 = {
        profile: {
          id: expect.anything(),
          lineId: data.lineId,
          twitterId: data.twitterId,
        },
        message: 'プロフィールの更新に成功しました。',
      }

      expect(response2.status).toEqual(201)
      expect(response2.body.data).toEqual(expectedJson2)
    })

    it('LINE_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

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

    it('Twitter_IDのみの更新に成功すること。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

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
