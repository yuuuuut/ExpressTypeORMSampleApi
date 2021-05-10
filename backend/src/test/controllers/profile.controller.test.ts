import { createTestUser, createFirebaseUser, authCheckMock, createTestProfile, addProfileTestUser } from '@/test/common'

/***************************
 *   Main
 **************************/
describe('Profile API Controller Test', () => {
  describe('PUT /api/profiles', () => {
    it('Profileの更新に成功すること。', async () => {
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      const data = {
        lineId: 'TestLineId',
        twitterId: 'TestTwitterId',
      }

      const response: TestIResponse<ProfileUpdateRes> = await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )

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
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      const response: TestIResponse<ProfileUpdateRes> = await authCheckMock(`/profiles/${testUser.id}`, 'PUT', {})

      expect(response.status).toEqual(403)
      expect(response.body.error?.message).toEqual('権限のないユーザーです。')
    })

    it('Bodyが空だった場合はProfileを現在のままにすること。', async () => {
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      const data = {
        lineId: 'TestLineId',
        twitterId: 'TestTwitterId',
      }

      const response: TestIResponse<ProfileUpdateRes> = await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )

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

      const response2: TestIResponse<ProfileUpdateRes> = await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        {}
      )

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
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      const data = {
        lineId: 'TestLineId',
      }

      const response: TestIResponse<ProfileUpdateRes> = await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )

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
      const testProfile = await createTestProfile()
      const testCurrentUser = await createFirebaseUser()
      await addProfileTestUser(testCurrentUser, testProfile)

      const data = {
        twitterId: 'TestTwitterId',
      }

      const response: TestIResponse<ProfileUpdateRes> = await authCheckMock(
        `/profiles/${testCurrentUser.id}`,
        'PUT',
        data
      )

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
