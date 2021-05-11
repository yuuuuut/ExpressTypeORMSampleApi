import { createTestUser, createFirebaseUser, authCheckMock, createTestRelationship, getTestUser } from '@/test/common'

/***************************
 *   Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('GET /api/users/:id/relationships', () => {
    it('フォローしているユーザーの一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      const currentUser = await getTestUser(testCurrentUser.id)

      const expectedJson = {
        followings: [
          {
            ...testUser,
            followers: testUser.followers,
            followings: testUser.followings,
            followersCount: '1',
            followingsCount: '0',
            rooms: [],
          },
        ],
        followers: [],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('1')
      expect(currentUser.followersCount).toEqual('0')
    })
    it('3人フォローしている場合、そのユーザーの一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testCurrentUser.id, testUser1.id)
      await createTestRelationship(testCurrentUser.id, testUser2.id)
      await createTestRelationship(testCurrentUser.id, testUser3.id)

      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      const currentUser = await getTestUser(testCurrentUser.id)
      const user1 = await getTestUser(testUser1.id)
      const user2 = await getTestUser(testUser2.id)
      const user3 = await getTestUser(testUser3.id)

      const expectedJson = {
        followings: [
          {
            ...user1,
            followers: user1.followers,
            followings: user1.followings,
            followersCount: user1.followersCount,
            followingsCount: user1.followingsCount,
            rooms: [],
          },
          {
            ...user2,
            followers: user2.followers,
            followings: user2.followings,
            followersCount: user2.followersCount,
            followingsCount: user2.followingsCount,
            rooms: [],
          },
          {
            ...user3,
            followers: user3.followers,
            followings: user3.followings,
            followersCount: user3.followersCount,
            followingsCount: user3.followingsCount,
            rooms: [],
          },
        ],
        followers: [],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('3')
      expect(currentUser.followersCount).toEqual('0')
    })
    it('フォローされているユーザーの一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      const currentUser = await getTestUser(testCurrentUser.id)

      const expectedJson = {
        followers: [
          {
            ...testUser,
            followers: testUser.followers,
            followings: testUser.followings,
            followersCount: '0',
            followingsCount: '1',
            rooms: [],
          },
        ],
        followings: [],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
      expect(currentUser.followersCount).toEqual('1')
    })
    it('3人からフォローされている場合、そのユーザーの一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testUser1.id, testCurrentUser.id)
      await createTestRelationship(testUser2.id, testCurrentUser.id)
      await createTestRelationship(testUser3.id, testCurrentUser.id)

      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      const currentUser = await getTestUser(testCurrentUser.id)
      const user1 = await getTestUser(testUser1.id)
      const user2 = await getTestUser(testUser2.id)
      const user3 = await getTestUser(testUser3.id)

      const expectedJson = {
        followers: [
          {
            ...user1,
            followers: user1.followers,
            followings: user1.followings,
            followersCount: user1.followersCount,
            followingsCount: user1.followingsCount,
            rooms: [],
          },
          {
            ...user2,
            followers: user2.followers,
            followings: user2.followings,
            followersCount: user2.followersCount,
            followingsCount: user2.followingsCount,
            rooms: [],
          },
          {
            ...user3,
            followers: user3.followers,
            followings: user3.followings,
            followersCount: user3.followersCount,
            followingsCount: user3.followingsCount,
            rooms: [],
          },
        ],
        followings: [],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
      expect(currentUser.followersCount).toEqual('3')
    })
    it('相互フォローしているユーザーがいる場合の一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      const currentUser = await getTestUser(testCurrentUser.id)

      const expectedJson = {
        followers: [
          {
            ...testUser,
            followers: testUser.followers,
            followings: testUser.followings,
            followersCount: '1',
            followingsCount: '1',
            rooms: [],
          },
        ],
        followings: [
          {
            ...testUser,
            followers: testUser.followers,
            followings: testUser.followings,
            followersCount: '1',
            followingsCount: '1',
            rooms: [],
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('1')
      expect(currentUser.followersCount).toEqual('1')
    })
  })

  describe('POST /api/users/:id/relationships', () => {
    it('フォローの作成ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'POST'
      )

      const currentUser = await getTestUser(testCurrentUser.id)

      const expectedJson = {
        message: 'フォローしました。',
        notification: {
          id: expect.anything(),
          action: 'FOLLOW',
          checked: false,
          visited: {
            id: testUser.id,
            displayName: testUser.displayName,
            isAdmin: testUser.isAdmin,
            photoURL: testUser.photoURL,
            followers: [
              {
                id: testCurrentUser.id,
                displayName: testCurrentUser.displayName,
                isAdmin: testCurrentUser.isAdmin,
                photoURL: testCurrentUser.photoURL,
                followings: [],
                followers: [],
                rooms: [],
              },
            ],
            followings: [],
            rooms: [],
          },
          visiter: {
            id: testCurrentUser.id,
            displayName: testCurrentUser.displayName,
            isAdmin: testCurrentUser.isAdmin,
            photoURL: testCurrentUser.photoURL,
            followings: [],
            followers: [],
            rooms: [],
          },
        },
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('1')
    })
    it('既にフォローしている場合、フォローの作成ができないこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'POST'
      )

      expect(response.status).toEqual(500)
      expect(response.body.error?.message).toEqual('既にフォローしています。')
    })
    it('自分自身をフォローできないこと。', async () => {
      const testCurrentUser = await createFirebaseUser()

      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'POST'
      )

      expect(response.status).toEqual(403)
      expect(response.body.error?.message).toEqual('権限のないユーザーです。')
    })
    it('異なる5人のユーザーをフォローした場合、6人目でErrorが発生すること。', async () => {
      const users = []
      for (let i = 1; i < 7; i++) {
        const user = await createTestUser(String(i))
        users.push(user)
      }

      await authCheckMock(`/users/${users[0].id}/relationships`, 'POST')
      await authCheckMock(`/users/${users[1].id}/relationships`, 'POST')
      await authCheckMock(`/users/${users[2].id}/relationships`, 'POST')
      await authCheckMock(`/users/${users[3].id}/relationships`, 'POST')
      await authCheckMock(`/users/${users[4].id}/relationships`, 'POST')

      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${users[5].id}/relationships`,
        'POST'
      )

      expect(response.status).toEqual(500)
      expect(response.body.error?.message).toEqual('今日のフォロー上限に達しました。')
    })
  })

  describe('DELETE /api/users/:id/relationships', () => {
    it(' フォローの解除ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const response: TestIResponse<RelationshipDestroyRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'DELETE'
      )

      const currentUser = await getTestUser(testCurrentUser.id)

      const expectedJson = {
        message: 'フォローを解除しました。',
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
    })
  })
})
