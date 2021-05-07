import { Request, Response } from 'express'

import * as model from '@/models/user.model'

/**
 * @description User Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<UserIndexRes> = {
    status: 200,
  }

  try {
    const users = await model.index()
    response.data = { users }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description User Controller Show
 */
const show = async (req: Request, res: Response) => {
  const response: IResponse<UserShowRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const data = await model.show(userId, currentUserId)
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
 * @description User Controller Create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<UserCreateRes> = {
    status: 201,
  }
  const body = req.body as UserCreateReq

  try {
    const { user, isCreate } = await model.create(body)
    response.data = {
      user,
      isCreate,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description User Controller Update
 */
const update = async (req: Request, res: Response) => {
  const response: IResponse<UserUpdateRes> = {
    status: 201,
  }
  const userId = req.params.id
  const body = req.body as UserUpdateReq

  try {
    const user = await model.update(userId, body)
    response.data = {
      user,
      message: 'Userを更新しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, show, create, update }
