import { Request, Response } from 'express'

import { IResponse, RoomCreateApiRes, RoomIndexApiRes, RoomShowApiRes } from '@/types'
import { getCuurentUser } from '@/models/common.model'
import * as model from '@/models/room.model'

/**
 * @description Room Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<RoomIndexApiRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const { rooms } = await model.index(currentUser)
    response.data = { rooms }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description Room Controller Show
 */
const show = async (req: Request, res: Response) => {
  const response: IResponse<RoomShowApiRes> = {
    status: 200,
  }
  const roomId = req.params.id

  try {
    const { room } = await model.show(roomId)
    response.data = { room }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description Room Controller Create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RoomCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const { room } = await model.create(userId, currentUser.id)
    response.data = { room }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, show, create }
