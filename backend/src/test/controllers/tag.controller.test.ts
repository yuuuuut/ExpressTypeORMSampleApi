import { Req, createTestUser, createTestTag, createFirebaseUser, addTagTestUser } from '@/test/common'

/***************************
 *    Main
 **************************/
describe('Tag Controller Test', () => {
  describe('GET /api/tags', () => {
    it('正しいresponseが返ってくること。', async () => {
      const testTags1 = await createTestTag('ゲーム')
      const testTags2 = await createTestTag('読書')

      const response: TestIResponse<TagIndexRes> = await Req.get('/tags')

      const expectedJson = {
        tags: [
          {
            id: testTags1.id,
            name: testTags1.name,
          },
          {
            id: testTags2.id,
            name: testTags2.name,
          },
        ],
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })

  describe('GET /api/tags/:id', () => {
    it('正しいresponseが返ってくること。', async () => {
      const testTags = await createTestTag('ゲーム')
      const testCurrentUser = await createFirebaseUser()
      await addTagTestUser(testCurrentUser, [testTags])

      const response: TestIResponse<TagIndexRes> = await Req.get(`/tags/${testTags.id}`)

      const expectedJson = {
        tag: {
          id: testTags.id,
          name: testTags.name,
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
              tags: [
                {
                  id: testTags.id,
                  name: testTags.name,
                },
              ],
            },
          ],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('正しいresponseが返ってくること。', async () => {
      const testTags1 = await createTestTag('ゲーム')
      const testTags2 = await createTestTag('読書')
      const testUser = await createTestUser()
      const testCurrentUser = await createFirebaseUser()
      await addTagTestUser(testUser, [testTags1, testTags2])
      await addTagTestUser(testCurrentUser, [testTags1])

      const response: TestIResponse<TagIndexRes> = await Req.get(`/tags/${testTags1.id}`)

      const expectedJson = {
        tag: {
          id: testTags1.id,
          name: testTags1.name,
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
              tags: [
                {
                  id: testTags1.id,
                  name: testTags1.name,
                },
              ],
            },
            {
              id: testUser.id,
              displayName: testUser.displayName,
              photoURL: testUser.photoURL,
              isAdmin: testUser.isAdmin,
              followers: testUser.followers,
              followings: testUser.followings,
              followersCount: '0',
              followingsCount: '0',
              rooms: [],
              tags: [
                {
                  id: testTags1.id,
                  name: testTags1.name,
                },
                {
                  id: testTags2.id,
                  name: testTags2.name,
                },
              ],
            },
          ],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
    it('正しいresponseが返ってくること。', async () => {
      const testTags1 = await createTestTag('ゲーム')
      const testTags2 = await createTestTag('読書')
      const testCurrentUser = await createFirebaseUser()
      await addTagTestUser(testCurrentUser, [testTags1, testTags2])

      const response: TestIResponse<TagIndexRes> = await Req.get(`/tags/${testTags1.id}`)

      const expectedJson = {
        tag: {
          id: testTags1.id,
          name: testTags1.name,
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
              tags: [
                {
                  id: testTags1.id,
                  name: testTags1.name,
                },
                {
                  id: testTags2.id,
                  name: testTags2.name,
                },
              ],
            },
          ],
        },
      }

      expect(response.status).toEqual(200)
      expect(response.body.data).toEqual(expectedJson)
    })
  })
})
