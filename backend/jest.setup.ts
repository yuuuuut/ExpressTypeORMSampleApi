import { createConnections, getConnection } from 'typeorm'
import redis from './src/lib/redis'

// Jest Setting
jest.setTimeout(30000)

// Before All
beforeAll(async () => {
  await createConnections()
  await cleanUpDB()
  await cleanUpRedis()
})

// After Each
afterEach(async () => {
  await cleanUpDB()
  await cleanUpRedis()
})

// After All
afterAll(async () => {
  const connection = getConnection()
  await connection.close()
})

/**
 * DBのデータを削除して、AUTO_INCREMENTをリセットします。
 */
async function cleanUpDB() {
  const connection = getConnection()
  const entities = connection.entityMetadatas

  for (let entity of entities) {
    const repository = connection.getRepository(entity.name)
    await repository.query(`DELETE FROM ${entity.tableName}`)
    await repository.query(`ALTER TABLE ${entity.tableName} AUTO_INCREMENT = 1`)
  }
}

/**
 * Redisのデータを削除します。
 */
async function cleanUpRedis() {
  await redis.flushall()
}
