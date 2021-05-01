import { createTestRoom, createTestUser, getTestUser } from '@/tests/common'
import { createFirebaseUser } from '@/tests/firebase'
import * as roomModel from '@/models/room.model'

/***************************
 *   Main
 **************************/
describe('Room Model Test', () => {
  describe('index Test', () => {
    it('戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const val = await roomModel.index(testCurrentUser)

      // ExpectedJson Data
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      const val = await roomModel.show(testRoom.id)

      // ExpectedJson Data
      const expectedJson = {
        room: {
          id: testRoom.id,
          users: [
            {
              id: testCurrentUser.id,
              displayName: testCurrentUser.displayName,
              photoURL: testCurrentUser.photoURL,
              isAdmin: testCurrentUser.isAdmin,
              followersCount: '0',
              followingsCount: '0',
              rooms: [],
            },
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
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
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      const val = roomModel.isRoomBool(user, currentUser)

      // ExpectedJson Data
      const expectedJson = {
        isRoom: true,
        roomId: testRoom.id,
      }

      expect(val).toEqual(expectedJson)
    })
    it('Roomが存在しない場合の戻り値が正しいこと。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()

      // Get Test Data
      const currentUser = await getTestUser(testCurrentUser.id)
      const user = await getTestUser(testUser.id)

      const val = roomModel.isRoomBool(user, currentUser)

      // ExpectedJson Data
      const expectedJson = {
        isRoom: false,
        roomId: undefined,
      }

      expect(val).toEqual(expectedJson)
    })
  })
})
