const { createConnection, getConnection } = require('typeorm')

beforeAll(async () => {
  await createConnection()
})

afterAll(async (done) => {
  const connection = getConnection()
  await connection.close()
  done()
})