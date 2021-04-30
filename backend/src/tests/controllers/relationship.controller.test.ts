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
    it('GET /api/users/:id/followings フォロー一覧の取得ができること。', async () => {
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
      const user = await getTestUser(testUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followings: [
          {
            id: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: user.isAdmin,
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
  describe('Followers Test', () => {
    it('GET /api/users/:id/followers フォロワー一覧の取得ができること。', async () => {
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
      const user = await getTestUser(testUser.id)

      // ExpectedJson Data
      const expectedJson = {
        followers: [
          {
            id: user.id,
            displayName: user.displayName,
            photoURL: user.photoURL,
            isAdmin: user.isAdmin,
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
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
