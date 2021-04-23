import { Request, Response } from 'express'

import {
  IResponse,
  UserCreateApiRes,
  UserIndexApiRes,
  UserShowApiRes,
} from '../types'
import * as model from '../models/user.model'
import { User } from '../entities'

/**
 * user controller index
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
 * user controller show
 */
const show = async (req: Request, res: Response) => {
  const response: IResponse<UserShowApiRes> = {
    status: 200,
  }
  const id = req.params.id

  try {
    const data = await model.show(id)
    response.data = { user: data.user }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * user controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<UserCreateApiRes> = {
    status: 201,
  }
  const body = req.body as Pick<User, 'id' | 'displayName' | 'photoURL'>

  try {
    const data = await model.create(body)
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

export { index, show, create }
