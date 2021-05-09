import { createTestRelationship, createTestUser, getTestUser } from '@/tests/common'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'

/***************************
 *   Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('GET /api/users/:id/relationships', () => {
    it('フォローしているユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      // Response
      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followings: [
          {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testCurrentUser.id, testUser1.id)
      await createTestRelationship(testCurrentUser.id, testUser2.id)
      await createTestRelationship(testCurrentUser.id, testUser3.id)

      // Response
      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user1 = await getTestUser(testUser1.id)
      const user2 = await getTestUser(testUser2.id)
      const user3 = await getTestUser(testUser3.id)

      // ExpectedJson Data
      const expectedJson = {
        followings: [
          {
            id: user1.id,
            displayName: user1.displayName,
            photoURL: user1.photoURL,
            isAdmin: user1.isAdmin,
            followers: user1.followers,
            followings: user1.followings,
            followersCount: user1.followersCount,
            followingsCount: user1.followingsCount,
            rooms: [],
          },
          {
            id: user2.id,
            displayName: user2.displayName,
            photoURL: user2.photoURL,
            isAdmin: user2.isAdmin,
            followers: user2.followers,
            followings: user2.followings,
            followersCount: user2.followersCount,
            followingsCount: user2.followingsCount,
            rooms: [],
          },
          {
            id: user3.id,
            displayName: user3.displayName,
            photoURL: user3.photoURL,
            isAdmin: user3.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser.id, testCurrentUser.id)

      // Response
      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followers: [
          {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testUser1.id, testCurrentUser.id)
      await createTestRelationship(testUser2.id, testCurrentUser.id)
      await createTestRelationship(testUser3.id, testCurrentUser.id)

      // Response
      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user1 = await getTestUser(testUser1.id)
      const user2 = await getTestUser(testUser2.id)
      const user3 = await getTestUser(testUser3.id)

      // ExpectedJson Data
      const expectedJson = {
        followers: [
          {
            id: user1.id,
            displayName: user1.displayName,
            photoURL: user1.photoURL,
            isAdmin: user1.isAdmin,
            followers: user1.followers,
            followings: user1.followings,
            followersCount: user1.followersCount,
            followingsCount: user1.followingsCount,
            rooms: [],
          },
          {
            id: user2.id,
            displayName: user2.displayName,
            photoURL: user2.photoURL,
            isAdmin: user2.isAdmin,
            followers: user2.followers,
            followings: user2.followings,
            followersCount: user2.followersCount,
            followingsCount: user2.followingsCount,
            rooms: [],
          },
          {
            id: user3.id,
            displayName: user3.displayName,
            photoURL: user3.photoURL,
            isAdmin: user3.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      // Response
      const response: TestIResponse<RelationshipIndexRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'GET'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followers: [
          {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
            followers: testUser.followers,
            followings: testUser.followings,
            followersCount: '1',
            followingsCount: '1',
            rooms: [],
          },
        ],
        followings: [
          {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'POST'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        message: 'フォローしました。',
      }

      expect(response.status).toEqual(201)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('1')
    })
    it('既にフォローしている場合、フォローの作成ができないこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      // Response
      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'POST'
      )

      expect(response.status).toEqual(500)
      expect(response.body.error?.message).toEqual('既にフォローしています。')
    })
    it('自分自身をフォローできないこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      // Response
      const response: TestIResponse<RelationshipCreateRes> = await authCheckMock(
        `/users/${testCurrentUser.id}/relationships`,
        'POST'
      )

      expect(response.status).toEqual(403)
      expect(response.body.error?.message).toEqual('権限のないユーザーです。')
    })
    it('異なる5人のユーザーをフォローした場合、6人目でErrorが発生すること。', async () => {
      // Create Test Data
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

      // Response
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      // Response
      const response: TestIResponse<RelationshipDestroyRes> = await authCheckMock(
        `/users/${testUser.id}/relationships`,
        'DELETE'
      )

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        message: 'フォローを解除しました。',
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
    })
  })
})
