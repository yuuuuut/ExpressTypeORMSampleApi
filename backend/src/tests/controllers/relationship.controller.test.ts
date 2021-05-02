import {
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  RelationshipFollowersApiRes,
  RelationshipFollowingsApiRes,
  TestIResponse,
} from '@/types'

import { createTestRelationship, createTestUser, getTestUser } from '@/tests/common'
import { authCheckMock, createFirebaseUser } from '@/tests/firebase'

/***************************
 *    Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('Followings Test', () => {
    it('GET /api/users/:id/followings フォローしているユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followings`,
        'GET'
      )) as TestIResponse<RelationshipFollowingsApiRes>

      console.log(response.body)

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
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('1')
      expect(currentUser.followersCount).toEqual('0')
    })
    it('GET /api/users/:id/followings 3人フォローしている場合、そのユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testCurrentUser.id, testUser1.id)
      await createTestRelationship(testCurrentUser.id, testUser2.id)
      await createTestRelationship(testCurrentUser.id, testUser3.id)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followings`,
        'GET'
      )) as TestIResponse<RelationshipFollowingsApiRes>

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
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('3')
      expect(currentUser.followersCount).toEqual('0')
    })
  })

  describe('Followers Test', () => {
    it('GET /api/users/:id/followers フォローされているユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser.id, testCurrentUser.id)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followers`,
        'GET'
      )) as TestIResponse<RelationshipFollowersApiRes>

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followers: [
          {
            id: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: user.isAdmin,
            followers: user.followers,
            followings: user.followings,
            followersCount: user.followersCount,
            followingsCount: user.followingsCount,
            rooms: [],
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
      expect(currentUser.followersCount).toEqual('1')
    })
    it('GET /api/users/:id/followers 3人からフォローされている場合、そのユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')
      const testUser3 = await createTestUser('user3')
      await createTestRelationship(testUser1.id, testCurrentUser.id)
      await createTestRelationship(testUser2.id, testCurrentUser.id)
      await createTestRelationship(testUser3.id, testCurrentUser.id)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followers`,
        'GET'
      )) as TestIResponse<RelationshipFollowersApiRes>

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
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
      expect(currentUser.followingsCount).toEqual('0')
      expect(currentUser.followersCount).toEqual('3')
    })
  })

  describe('Create Test', () => {
    it('POST /api/users/:id/follow フォローの作成ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Response
      const response = (await authCheckMock(
        `/users/${testUser.id}/follow`,
        'POST'
      )) as TestIResponse<RelationshipCreateApiRes>

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
    it('POST /api/users/:id/follow 自分をフォローできないこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/follow`,
        'POST'
      )) as TestIResponse<RelationshipCreateApiRes>

      expect(response.status).toEqual(500)
      expect(response.body.error?.message).toEqual('自分自身をフォローすることはできません。')
    })
  })

  describe('Destroy Test', () => {
    it('DELETE /api/users/:id/unfollow フォローの解除ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      // Response
      const response = (await authCheckMock(
        `/users/${testUser.id}/unfollow`,
        'DELETE'
      )) as TestIResponse<RelationshipDestroyApiRes>

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
