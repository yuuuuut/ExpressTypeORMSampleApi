import { Request, Response } from 'express'

import { IResponse, UserCreateApiReq, UserCreateApiRes, UserIndexApiRes, UserShowApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as model from '../models/user.model'

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
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const data = await model.show(userId, currentUser)
    response.data = {
      user: data.user,
      isFollowing: data.isFollowing,
      isMutualFollow: data.isMutualFollow,
      isRoom: data.isRoom,
      roomId: data.roomId,
    }
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
  const body = req.body as UserCreateApiReq

  try {
    const { user, isCreate } = await model.create(body)
    response.data = { user, isCreate }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, show, create }
