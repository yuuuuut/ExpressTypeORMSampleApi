import { createTestEntry, createTestRoom, createTestUser } from '../common'
import { getOpponentUser } from '../../models/entry.model'
import { createFirebaseUser } from '../firebase'

/***************************
 *    Main
 **************************/
describe('Room Model Test', () => {
  describe('getOpponentUser Test', () => {
    it('正常に動作し、otherEntryを返すこと。', async () => {
      // Create Test Data
      const currentUser = await createFirebaseUser()
      const user = await createTestUser()
      const room = await createTestRoom()
      await createTestEntry(currentUser, room)
      await createTestEntry(user, room)

      const otherEntry = await getOpponentUser(room, currentUser)

      expect(otherEntry.user).toEqual(user)
    })
  })
})
