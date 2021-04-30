import { createTestRelationship, createTestUser } from '../common'
import * as userModel from '../../models/user.model'
import { createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Relationship Model Test', () => {
  describe('isFollowingBool Test', () => {
    it('Userをフォローしている場合、Trueを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testUser, testCurrentUser)

      const val = await userModel.isFollowingBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('Userをフォローしていない場合、Falseを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const val = await userModel.isFollowingBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })

  describe('isMutualFollowBool Test', () => {
    it('相互フォローの場合、 Trueを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)
      await createTestRelationship(testUser, testCurrentUser)

      const val = await userModel.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('相互フォローでない場合、 Falseを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const val = await userModel.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })
})
