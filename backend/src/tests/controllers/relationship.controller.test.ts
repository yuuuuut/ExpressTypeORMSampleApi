import {
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  RelationshipFollowersApiRes,
  RelationshipFollowingsApiRes,
  TestIResponse,
} from '../../types'

import { createTestRelationship, createTestUser, deleteTestUser, getTestUser } from '../common'
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
      await createTestRelationship(testCurrentUser, testUser)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followings`,
        'GET'
      )) as TestIResponse<RelationshipFollowingsApiRes>

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)
      // Delete FirebaseCurrentUser
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(currentUser.followingsCount).toEqual('1')
      expect(response.body.data.followings[0].follow).toEqual(user)
    })
  })
  describe('Followers Test', () => {
    it('GET /api/users/:id/followers フォロワー一覧の取得ができること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser, testCurrentUser)

      // Response
      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followers`,
        'GET'
      )) as TestIResponse<RelationshipFollowersApiRes>

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)
      // Delete FirebaseCurrentUser
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(currentUser.followersCount).toEqual('1')
      expect(response.body.data.followers[0].user).toEqual(user)
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
      // Delete FirebaseCurrentUser
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.message).toEqual('フォローしました。')
      expect(currentUser.followingsCount).toEqual('1')
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
      // Delete FirebaseCurrentUser
      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.message).toEqual('フォローを解除しました。')
      expect(currentUser.followingsCount).toEqual('0')
    })
  })
})
