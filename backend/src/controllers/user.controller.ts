import { Request, Response } from 'express'

import { IResponse, UserCreateApiRes, UserIndexApiRes } from '../commons/types'
import * as model from '../models/user.model'

/**
 * UserIndex
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<UserIndexApiRes> = {
    status: 200,
  }

  try {
    const users = await model.index()
    response.data = { users: users }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * UserCreate
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<UserCreateApiRes> = {
    status: 201,
  }

  try {
    const data = await model.create(req)
    response.data = {
      user: data.user,
      profile: data.profile,
      isCreate: data.isCreate,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, create }
