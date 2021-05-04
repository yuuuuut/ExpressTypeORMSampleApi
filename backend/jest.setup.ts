import { createConnections, getConnection } from 'typeorm'

beforeAll(async () => {
  await createConnections()

  const connection = getConnection()
  const entities = connection.entityMetadatas

  for (let entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.query(`DELETE FROM ${entity.tableName}`)
    await repository.query(`ALTER TABLE ${entity.tableName} AUTO_INCREMENT = 1`)
  }
})

afterEach(async () => {
  const connection = getConnection()
  const entities = connection.entityMetadatas

  for (let entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.query(`DELETE FROM ${entity.tableName}`)
    await repository.query(`ALTER TABLE ${entity.tableName} AUTO_INCREMENT = 1`)
  }
})

afterAll(async () => {
  const connection = getConnection()
  await connection.close()
})
