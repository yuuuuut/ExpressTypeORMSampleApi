import { getOpponentUser } from '../../models/entry.model'
import { createFirebaseUser } from '../firebase'
import {
  createTestEntry,
  createTestRoom,
  createTestUser,
  deleteTestRoom,
  deleteTestUser,
} from '../common'

/***************************
 *    Main
 **************************/
describe('Room Model Test', () => {
  describe('getOpponentUser Test', () => {
    it('正常に動作し、otherEntryを返すこと。', async () => {
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(currentUser, room)
      await createTestEntry(user, room)

      const otherEntry = await getOpponentUser(room, currentUser)

      await deleteTestRoom(room.id)
      await deleteTestUser(currentUser.id)

      expect(otherEntry.user).toEqual(user)
    })
  })
})
