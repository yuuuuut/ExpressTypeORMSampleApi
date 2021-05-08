import { authCheckMock, createFirebaseUser } from '@/tests/firebase'
import { addProfileTestUser, createTestProfile, createTestUser } from '@/tests/common'

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
      const response = (await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateRes>

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

    it('CurrentUserでないとProfileの更新ができないこと。', async () => {
      // Create Test Data
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      // Response
      const response = (await authCheckMock(`/profiles/${testUser.id}`, 'PUT', {})) as TestIResponse<ProfileUpdateRes>

      expect(response.status).toEqual(403)
      expect(response.body.error?.message).toEqual('権限のないユーザーです。')
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
      const response = (await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateRes>

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
      const response2 = (await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        {}
      )) as TestIResponse<ProfileUpdateRes>

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
      const response = (await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateRes>

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
      const response = (await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )) as TestIResponse<ProfileUpdateRes>

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
