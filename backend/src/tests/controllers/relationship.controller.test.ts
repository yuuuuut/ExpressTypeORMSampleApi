import { getManager } from 'typeorm'

import {
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  RelationshipFollowersApiRes,
  RelationshipFollowingsApiRes,
  TestIResponse,
} from '../../types'

import { createTestRelationship, createTestUser, deleteTestUser } from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { User } from '../../entities'

/***************************
 *    Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('Followings Test', () => {
    it('GET /api/users/:id/followings フォロー一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followings`,
        'GET'
      )) as TestIResponse<RelationshipFollowingsApiRes>

      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.followings[0].follow).toEqual(testUser)
    })
  })
  describe('Followers Test', () => {
    it('GET /api/users/:id/followers フォロワー一覧の取得ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser, testCurrentUser)

      const response = (await authCheckMock(
        `/users/${testCurrentUser.id}/followers`,
        'GET'
      )) as TestIResponse<RelationshipFollowersApiRes>

      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.followers[0].user).toEqual(testUser)
    })
  })
  describe('Create Test', () => {
    it('POST /api/users/:id/follow フォローの作成ができること。', async () => {
      const userRepository = getManager().getRepository(User)
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const response = (await authCheckMock(
        `/users/${testUser.id}/follow`,
        'POST'
      )) as TestIResponse<RelationshipCreateApiRes>

      const currentUser = await userRepository.findOne(testCurrentUser.id, {
        relations: ['followings', 'followings.follow'],
      })
      if (!currentUser) throw new Error('Test Failed')

      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.message).toEqual('フォローしました。')
      expect(currentUser.followings[0].follow).toEqual(testUser)
    })
  })

  describe('Destroy Test', () => {
    it('DELETE /api/users/:id/unfollow フォローの解除ができること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const response = (await authCheckMock(
        `/users/${testUser.id}/unfollow`,
        'DELETE'
      )) as TestIResponse<RelationshipDestroyApiRes>

      await deleteTestUser(testCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.message).toEqual('フォローを解除しました。')
    })
  })
})
