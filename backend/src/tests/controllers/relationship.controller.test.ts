import { getManager } from 'typeorm'

import { RelationshipCreateApiRes, TestIResponse } from '../../commons/types'
import { authCheckMock, createFirebaseUser } from '../firebase'
import { createTestUser, deleteTestUser } from '../common'
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
})
