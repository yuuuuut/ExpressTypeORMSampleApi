import {
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  RelationshipFollowersApiRes,
  RelationshipFollowingsApiRes,
  TestIResponse,
} from '../../types'

import { createTestRelationship, createTestUser, getTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('Followings Test', () => {
    it('GET /api/users/:id/followings フォローしているユーザーの一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser, testCurrentUser)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followings`,
        'GET'
      )) as TestIResponse<RelationshipFollowingsApiRes>

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followings: [
          {
            id: expect.anything(),
            follower: {
              id: user.id,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAdmin: user.isAdmin,
              followersCount: user.followersCount,
              followingsCount: user.followingsCount,
            },
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
      await createTestRelationship(testCurrentUser, testUser1)
      await createTestRelationship(testCurrentUser, testUser2)
      await createTestRelationship(testCurrentUser, testUser3)

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
            id: expect.anything(),
            follower: {
              id: user1.id,
              displayName: user1.displayName,
              photoURL: user1.photoURL,
              isAdmin: user1.isAdmin,
              followersCount: user1.followersCount,
              followingsCount: user1.followingsCount,
            },
          },
          {
            id: expect.anything(),
            follower: {
              id: user2.id,
              displayName: user2.displayName,
              photoURL: user2.photoURL,
              isAdmin: user2.isAdmin,
              followersCount: user2.followersCount,
              followingsCount: user2.followingsCount,
            },
          },
          {
            id: expect.anything(),
            follower: {
              id: user3.id,
              displayName: user3.displayName,
              photoURL: user3.photoURL,
              isAdmin: user3.isAdmin,
              followersCount: user3.followersCount,
              followingsCount: user3.followingsCount,
            },
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
      await createTestRelationship(testCurrentUser, testUser)

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
            id: expect.anything(),
            followed: {
              id: user.id,
              displayName: user.displayName,
              photoURL: user.photoURL,
              isAdmin: user.isAdmin,
              followersCount: user.followersCount,
              followingsCount: user.followingsCount,
            },
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
      await createTestRelationship(testUser1, testCurrentUser)
      await createTestRelationship(testUser2, testCurrentUser)
      await createTestRelationship(testUser3, testCurrentUser)

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
            id: expect.anything(),
            followed: {
              id: user1.id,
              displayName: user1.displayName,
              photoURL: user1.photoURL,
              isAdmin: user1.isAdmin,
              followersCount: user1.followersCount,
              followingsCount: user1.followingsCount,
            },
          },
          {
            id: expect.anything(),
            followed: {
              id: user2.id,
              displayName: user2.displayName,
              photoURL: user2.photoURL,
              isAdmin: user2.isAdmin,
              followersCount: user2.followersCount,
              followingsCount: user2.followingsCount,
            },
          },
          {
            id: expect.anything(),
            followed: {
              id: user3.id,
              displayName: user3.displayName,
              photoURL: user3.photoURL,
              isAdmin: user3.isAdmin,
              followersCount: user3.followersCount,
              followingsCount: user3.followingsCount,
            },
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
    })
  })

  describe('Destroy Test', () => {
    it('DELETE /api/users/:id/unfollow フォローの解除ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

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
      //expect(currentUser.followingsCount).toEqual('0')
    })
  })
})
