import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import { createConnection } from 'typeorm'

import router from '@/routes'

/***************************
 *   Settings
 **************************/
dotenv.config()

/***************************
 *   Main
 **************************/
createConnection()
  .then(async (connection) => {
    console.log(connection.options)

    const app = express()
    const PORT = 4000

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    //@ts-ignore
    app.use(cors())
    app.use(router)

    app.listen(PORT, () => console.log(`Server OK http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.log('TypeORM connection error: ', err)
  })
