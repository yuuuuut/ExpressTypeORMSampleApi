import { createTestTag, Req } from '@/tests/common'
import { TagIndexRes, TestIResponse } from '@/types'

/***************************
 *    Main
 **************************/
describe('Tag Controller Test', () => {
  describe('GET /api/tags', () => {
    it('Tagsの取得ができること。', async () => {
      // Create Test Data
      const tags = await createTestTag()

      // Response
      const response = (await Req.get('/tags')) as TestIResponse<TagIndexRes>

      // ExpectedJson Data
      const expectedJson = {
        tags: tags,
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
