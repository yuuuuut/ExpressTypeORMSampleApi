import { createTestRoom, createTestUser, getTestUser } from '@/tests/common'
import { createFirebaseUser } from '@/tests/firebase'
import * as roomModel from '@/models/room.model'

/***************************
 *   Main
 **************************/
describe('Room Model Test', () => {
  describe('index Test', () => {
    it('戻り値が正しいこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const val = await roomModel.index(testCurrentUser.id)

      const expectedJson = {
        rooms: [
          {
            id: testRoom.id,
          },
        ],
      }

      expect(val).toEqual(expectedJson)
    })
  })

  describe('show Test', () => {
    it('戻り値が正しいこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const val = await roomModel.show(testRoom.id, testCurrentUser.id)

      const expectedJson = {
        room: {
          id: testRoom.id,
          users: [
            {
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
            {
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
          ],
        },
      }

      expect(val).toEqual(expectedJson)
    })
  })

  describe('isRoomBool Test', () => {
    it('Roomが存在する場合の戻り値が正しいこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      const val = roomModel.isRoomBool(user, currentUser)

      const expectedJson = {
        isRoom: true,
        roomId: testRoom.id,
      }

      expect(val).toEqual(expectedJson)
    })
    it('Roomが存在しない場合の戻り値が正しいこと。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      const val = roomModel.isRoomBool(user, currentUser)

      const expectedJson = {
        isRoom: false,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
  })

  describe('isUserBelongstoRoom Test', () => {
    it('正しく動作すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      expect(() =>
        roomModel.__local__.isUserBelongstoRoom([testCurrentUser, testUser], testCurrentUser.id)
      ).not.toThrow()
    })
    it('正しく動作すること。', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      expect(() => roomModel.__local__.isUserBelongstoRoom([testCurrentUser, testUser], testUser.id)).not.toThrow()
    })
    it('Roomに所属しないUserだった場合、Errorが発生すること', async () => {
      const testCurrentUser = await createFirebaseUser()
      const testUser1 = await createTestUser('user1')
      const testUser2 = await createTestUser('user2')

      expect(() => roomModel.__local__.isUserBelongstoRoom([testCurrentUser, testUser1], testUser2.id)).toThrow(
        '許可されていない操作です。'
      )
    })
  })
})
