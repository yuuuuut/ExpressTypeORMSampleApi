const { createConnection, getConnection } = require('typeorm')
const { deleteTestUser } = require('./src/tests/common')

beforeAll(async () => {
  await createConnection()
})

afterEach(async () => {
  await deleteTestUser('TestUser')
})

afterAll(async (done) => {
  const connection = getConnection()
  await connection.close()
  done()
})