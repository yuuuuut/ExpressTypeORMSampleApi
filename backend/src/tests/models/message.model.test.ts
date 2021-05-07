import { createTestMessage, createTestRoom, createTestUser } from '@/tests/common'
import { createFirebaseUser } from '@/tests/firebase'
import * as model from '@/models/message.model'

/***************************
 *   Main
 **************************/
describe('Message Model Test', () => {
  describe('update Test', () => {
    it('body.typeがIS_APPROVALの場合、IS_APPROVALをTrueにすること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      const body = {
        type: 'IS_APPROVAL',
      } as MessageUpdateReq

      const val = await model.update(body, String(testMessage.id))

      // ExpectedJson Data
      const expectedJson = {
        id: expect.anything(),
        kind: testMessage.kind,
        isApproval: true,
        rejected: testMessage.rejected,
        checked: testMessage.checked,
      }

      expect(val).toEqual(expectedJson)
    })
    it('body.typeがREJECTEDの場合、REJECTEDをTrueにすること。', async () => {
      // Create Test Data
      const testCurrentUser = await createFirebaseUser()
      const testUser = await createTestUser()
      const testRoom = await createTestRoom(testUser, testCurrentUser)
      const testMessage = await createTestMessage(testCurrentUser, testRoom)

      const body = {
        type: 'REJECTED',
      } as MessageUpdateReq

      const val = await model.update(body, String(testMessage.id))

      // ExpectedJson Data
      const expectedJson = {
        id: expect.anything(),
        kind: testMessage.kind,
        isApproval: testMessage.isApproval,
        rejected: true,
        checked: testMessage.checked,
      }

      expect(val).toEqual(expectedJson)
    })
  })
})
