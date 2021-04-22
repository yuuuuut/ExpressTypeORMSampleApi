import { getManager } from 'typeorm'

import {
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  TestIResponse,
} from '../../commons/types'
import {
  createTestRelationship,
  createTestUser,
  deleteTestUser,
} from '../common'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { User } from '../../entities'

/***************************
 *    Main
 **************************/
describe('Relationship API Controller Test', () => {
  describe('Create Test', () => {
    it('POST /api/users/:id/follow フォローの作成ができること。', async () => {
      const userRepository = getManager().getRepository(User)
      const TestcurrentUser = await createFirebaseUser()
      const TestfollowUser = await createTestUser()

      const response = (await authCheckMock(
        `/users/${TestfollowUser.id}/follow`,
        'POST'
      )) as TestIResponse<RelationshipCreateApiRes>

      const currentUser = await userRepository.findOne(TestcurrentUser.id, {
        relations: ['followings', 'followings.follow'],
      })
      if (!currentUser) throw new Error('Test Failed')

      await deleteTestUser(TestcurrentUser.id)

      expect(response.status).toEqual(201)
      expect(response.body.data.message).toEqual('フォローしました。')
      expect(currentUser.followings[0].follow).toEqual(TestfollowUser)
    })
  })

  describe('Destroy Test', () => {
    it('DELETE /api/users/:id/unfollow フォローの解除ができること。', async () => {
      const TestCurrentUser = await createFirebaseUser()
      const TestfollowUser = await createTestUser()
      await createTestRelationship(TestCurrentUser, TestfollowUser)

      const response = (await authCheckMock(
        `/users/${TestfollowUser.id}/unfollow`,
        'DELETE'
      )) as TestIResponse<RelationshipDestroyApiRes>

      await deleteTestUser(TestCurrentUser.id)

      expect(response.status).toEqual(200)
      expect(response.body.data.message).toEqual('フォローを解除しました。')
    })
  })
})
