// @ts-nocheck
require('dotenv').config()

const host = {
  dev: 'db',
  test: 'test-db',
}

const username = {
  dev: process.env.USERNAME,
  test: process.env.TEST_USERNAME,
}

const password = {
  dev: process.env.PASSWORD,
  test: process.env.TEST_PASSWORD,
}

const database = {
  dev: process.env.DATABASE,
  test: process.env.TEST_DATABASE,
}

const option = {
  name: 'default',
  type: 'mysql',
  port: 3306,
  /*
  host: 'test-db',
  username: process.env.TEST_USERNAME,
  password: process.env.TEST_PASSWORD,
  database: process.env.TEST_DATABASE,
  */
  host: host[process.env.NODE_ENV],
  username: username[process.env.NODE_ENV],
  password: password[process.env.NODE_ENV],
  database: database[process.env.NODE_ENV],
  synchronize: false,
  logging: false,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
  },
}

export = option
