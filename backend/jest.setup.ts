import { createConnections, getConnection } from 'typeorm'

beforeAll(async () => {
  await createConnections()
})

afterEach(async () => {
  const connection = getConnection()
  const entities = connection.entityMetadatas

  for (let entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.query(`DELETE FROM ${entity.tableName}`)
  }
})

afterAll(async () => {
  const connection = getConnection()
  await connection.close()
})
