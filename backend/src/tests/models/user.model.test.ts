import { createTestRelationship, createTestRoom, createTestUser } from '@/tests/common'
import { createFirebaseUser } from '@/tests/firebase'
import * as userModel from '@/models/user.model'
import { __local__ } from '@/models/user.model'

/***************************
 *   Main
 **************************/
describe('User Model Test', () => {
  describe('Show Test', () => {
    it('userIdがCurrentUserの場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      const val = await userModel.show(testCurrentUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testCurrentUser.id,
          displayName: testCurrentUser.displayName,
          photoURL: testCurrentUser.photoURL,
          isAdmin: testCurrentUser.isAdmin,
          followersCount: '0',
          followingsCount: '0',
        },
        isFollowing: undefined,
        isMutualFollow: undefined,
        isRoom: undefined,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
    it('userIdが他人の場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followersCount: '0',
          followingsCount: '0',
        },
        isFollowing: false,
        isMutualFollow: false,
        isRoom: false,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
    it('ユーザーをフォローしているの場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followersCount: '1',
          followingsCount: '0',
        },
        isFollowing: true,
        isMutualFollow: false,
        isRoom: false,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
    it('相互フォローの場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)
      await createTestRelationship(testUser, testCurrentUser)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followersCount: '1',
          followingsCount: '1',
        },
        isFollowing: true,
        isMutualFollow: true,
        isRoom: false,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
    it('相互フォローかつRoomが存在しているの場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)
      await createTestRelationship(testUser, testCurrentUser)
      const testRoom = await createTestRoom(testCurrentUser, testUser)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followersCount: '1',
          followingsCount: '1',
        },
        isFollowing: true,
        isMutualFollow: true,
        isRoom: true,
        roomId: testRoom.id,
      }

      expect(val).toEqual(expectedJson)
    })
  })

  describe('Create Test', () => {
    it('Userが存在しない場合の戻り値が正しいこと。', async () => {
      // Test Data
      const userData = {
        id: 'TestUser',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      const val = await userModel.create(userData)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: userData.id,
          displayName: userData.displayName,
          photoURL: userData.photoURL,
          isAdmin: false,
          profile: {
            id: expect.anything(),
            lineId: null,
            twitterId: null,
          },
        },
        isCreate: true,
      }

      expect(val).toEqual(expectedJson)
    })
    it('Userが存在する場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      // Test Data
      const userData = {
        id: testCurrentUser.id,
        displayName: testCurrentUser.displayName,
        photoURL: testCurrentUser.photoURL,
      }

      const val = await userModel.create(userData)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testCurrentUser.id,
          displayName: testCurrentUser.displayName,
          photoURL: testCurrentUser.photoURL,
          isAdmin: testCurrentUser.isAdmin,
          followersCount: '0',
          followingsCount: '0',
        },
        isCreate: false,
      }

      expect(val).toEqual(expectedJson)
    })
  })

  describe('followings Test', () => {
    it('フォローしているユーザーがいる場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const val = await userModel.followings(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = [
        {
          id: expect.anything(),
          follower: {
            id: testUser.id,
            displayName: testUser.displayName,
            photoURL: testUser.photoURL,
            isAdmin: testUser.isAdmin,
            followersCount: '1',
            followingsCount: '0',
          },
        },
      ]

      expect(val).toEqual(expectedJson)
    })
    it('フォローしているユーザーがいない場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()

      const val = await userModel.followings(testCurrentUser.id)

      expect(val).toEqual([])
    })
  })

  describe('isFollowingBool Test', () => {
    it('Userをフォローしている場合、Trueを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const val = await __local__.isFollowingBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('Userをフォローしていない場合、Falseを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const val = await __local__.isFollowingBool(testUser.id, testCurrentUser.id)

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

      const val = await __local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('相互フォローでない場合、 Falseを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser, testUser)

      const val = await __local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })
})
