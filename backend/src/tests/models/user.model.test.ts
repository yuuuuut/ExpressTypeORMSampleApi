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
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
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
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
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
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followers: [],
          followings: [],
          followersCount: '1',
          followingsCount: '0',
          rooms: [],
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
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followers: [],
          followings: [],
          followersCount: '1',
          followingsCount: '1',
          rooms: [],
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
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)
      const testRoom = await createTestRoom(testCurrentUser, testUser)

      const val = await userModel.show(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = {
        user: {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followers: [],
          followings: [],
          followersCount: '1',
          followingsCount: '1',
          rooms: [
            {
              id: testRoom.id,
            },
          ],
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
          followers: [],
          followings: [],
          followersCount: '0',
          followingsCount: '0',
          rooms: [],
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
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await userModel.followings(testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = [
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

  describe('getUserAndRelationships Test', () => {
    it('正しい戻り値を返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await __local__.getUserAndRelationships(testUser.id, testCurrentUser.id)

      // ExpectedJson Data
      const expectedJson = [
        {
          id: testCurrentUser.id,
          displayName: testCurrentUser.displayName,
          photoURL: testCurrentUser.photoURL,
          isAdmin: testCurrentUser.isAdmin,
          followers: testCurrentUser.followers,
          followings: testCurrentUser.followings,
          followersCount: testCurrentUser.followersCount,
          followingsCount: testCurrentUser.followingsCount,
          rooms: testCurrentUser.rooms,
        },
        {
          id: testUser.id,
          displayName: testUser.displayName,
          photoURL: testUser.photoURL,
          isAdmin: testUser.isAdmin,
          followers: testUser.followers,
          followings: testUser.followings,
          followersCount: testUser.followersCount,
          followingsCount: testUser.followingsCount,
          rooms: testUser.rooms,
        },
      ]
    })
  })

  describe('isFollowingBool Test', () => {
    it('Userをフォローしている場合、Trueを返すこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

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
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const val = await __local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('相互フォローでない場合、 Falseを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await __local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })
})