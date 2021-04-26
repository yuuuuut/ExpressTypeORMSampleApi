import * as relationshipModel from '../../models/relationship.model'
import { createFirebaseUser } from '../firebase'
import {
  createTestRelationship,
  createTestUser,
  deleteTestUser,
} from '../common'

/***************************
 *    Main
 **************************/
describe('Relationship Model Test', () => {
  describe('isFollowingBool Test', () => {
    it('Userをフォローしている場合、Trueを返すこと。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      await createTestRelationship(currentUser, user)

      const val = await relationshipModel.isFollowingBool(
        user.id,
        currentUser.id
      )

      await deleteTestUser(currentUser.id)

      expect(val).toEqual(true)
    })
    it('Userをフォローしていない場合、Falseを返すこと。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()

      const val = await relationshipModel.isFollowingBool(
        user.id,
        currentUser.id
      )

      await deleteTestUser(currentUser.id)

      expect(val).toEqual(false)
    })
  })

  describe('isMutualFollowBool Test', () => {
    it('相互フォローの場合、 Trueを返すこと。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      await createTestRelationship(currentUser, user)
      await createTestRelationship(user, currentUser)

      const val = await relationshipModel.isMutualFollowBool(
        user.id,
        currentUser.id
      )

      await deleteTestUser(currentUser.id)

      expect(val).toEqual(true)
    })
    it('相互フォローでない場合、 Falseを返すこと。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      await createTestRelationship(currentUser, user)

      const val = await relationshipModel.isMutualFollowBool(
        user.id,
        currentUser.id
      )

      await deleteTestUser(currentUser.id)

      expect(val).toEqual(false)
    })
  })
})
