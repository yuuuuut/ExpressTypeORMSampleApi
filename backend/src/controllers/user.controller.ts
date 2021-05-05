import { Request, Response } from 'express'

import { getCuurentUser } from '@/models/common.model'
import * as model from '@/models/user.model'
import * as types from '@/types'
//import IResponse, * as types from '@/types'

/**
 * @description User Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: types.IResponse<types.UserIndexApiRes> = {
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
  const response: types.IResponse<types.UserShowApiRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const data = await model.show(userId, currentUser.id)
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
  const response: types.IResponse<types.UserCreateApiRes> = {
    status: 201,
  }
  const body = req.body as types.UserCreateApiReq

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
  const response: types.IResponse<types.UserUpdateRes> = {
    status: 201,
  }
  const userId = req.params.id
  const body = req.body as types.UserUpdateReq

  try {
    const currentUser = await getCuurentUser(userId)
    const user = await model.update(currentUser.id, body)
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
