import { createFirebaseUser, createTestRelationship, createTestRoom, createTestUser } from '@/test/common'
import * as model from '@/model/user.model'

// Redis Mock
const RedisMock = require('ioredis-mock')

/***************************
 *   Main
 **************************/
describe('User Model Test', () => {
  describe('Show Test', () => {
    it('userIdがCurrentUserの場合の戻り値が正しいこと。', async () => {
      const testCurrentUser = await createFirebaseUser()

      const val = await model.show(testCurrentUser.id, testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const val = await model.show(testUser.id, testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await model.show(testUser.id, testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const val = await model.show(testUser.id, testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)
      const testRoom = await createTestRoom(testCurrentUser, testUser)

      const val = await model.show(testUser.id, testCurrentUser.id)

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
      const userData = {
        id: 'TestUser',
        displayName: 'TestUser',
        photoURL: 'TestUserPhoto',
      }

      const val = await model.create(userData)

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
      const testCurrentUser = await createFirebaseUser()

      const userData = {
        id: testCurrentUser.id,
        displayName: testCurrentUser.displayName,
        photoURL: testCurrentUser.photoURL,
      }

      const val = await model.create(userData)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await model.followings(testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()

      const val = await model.followings(testCurrentUser.id)

      expect(val).toEqual([])
    })
  })

  describe('follow Test', () => {
    it('followするユーザーが既にフォローされている場合、Errorが発生すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      await expect(model.follow(testUser.id, testCurrentUser.id)).rejects.toThrow('既にフォローしています。')
    })
  })

  describe('getUserAndRelationships Test', () => {
    it('正しい戻り値を返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await model.__local__.getUserAndRelationships(testUser.id, testCurrentUser.id)

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
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await model.__local__.isFollowingBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('Userをフォローしていない場合、Falseを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const val = await model.__local__.isFollowingBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })

  describe('isMutualFollowBool Test', () => {
    it('相互フォローの場合、 Trueを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)
      await createTestRelationship(testUser.id, testCurrentUser.id)

      const val = await model.__local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(true)
    })
    it('相互フォローでない場合、 Falseを返すこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      await createTestRelationship(testCurrentUser.id, testUser.id)

      const val = await model.__local__.isMutualFollowBool(testUser.id, testCurrentUser.id)

      expect(val).toEqual(false)
    })
  })

  describe('checkTodayFollowCount Test', () => {
    it('Redisの Follow List Length が0の場合、正常に動作すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Redis Mock
      const data = { data: { [`follow-${testCurrentUser.id}`]: [] } }
      const redisMock = new RedisMock(data)

      const val = await model.__local__.checkTodayFollowCount(redisMock, testUser.id, testCurrentUser.id)

      expect(val).toEqual([testUser.id])
    })
    it('Redisの Follow List Length が4の場合、正常に動作すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Redis Mock
      const dummyIds = ['1', '2', '3', '4']
      const data = { data: { [`follow-${testCurrentUser.id}`]: dummyIds } }
      const redisMock = new RedisMock(data)

      const val = await model.__local__.checkTodayFollowCount(redisMock, testUser.id, testCurrentUser.id)

      expect(val).toEqual([testUser.id, ...dummyIds])
    })
    it('Redisの Follow List Length が5の場合、Errorが発生すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Redis Mock
      const dummyIds = ['1', '2', '3', '4', '5']
      const data = { data: { [`follow-${testCurrentUser.id}`]: dummyIds } }
      const redisMock = new RedisMock(data)

      await expect(model.__local__.checkTodayFollowCount(redisMock, testUser.id, testCurrentUser.id)).rejects.toThrow(
        '今日のフォロー上限に達しました。'
      )
    })
    it('Redisの Follow List に既に存在するIDの場合、配列に追加しないこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Redis Mock
      const dummyIds = [testUser.id]
      const data = { data: { [`follow-${testCurrentUser.id}`]: dummyIds } }
      const redisMock = new RedisMock(data)

      const val = await model.__local__.checkTodayFollowCount(redisMock, testUser.id, testCurrentUser.id)

      expect(val).toEqual([testUser.id])
      expect(val.length).toEqual(dummyIds.length)
    })
    it('Redisの Follow List に既に存在するIDの場合、配列に追加しないこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Redis Mock
      const dummyIds = ['1', '2', '3', testUser.id]
      const data = { data: { [`follow-${testCurrentUser.id}`]: dummyIds } }
      const redisMock = new RedisMock(data)

      const val = await model.__local__.checkTodayFollowCount(redisMock, testUser.id, testCurrentUser.id)

      expect(val).toEqual([...dummyIds])
      expect(val.length).toEqual(dummyIds.length)
    })
  })
})
