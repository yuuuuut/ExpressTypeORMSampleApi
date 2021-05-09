import { Request, Response } from 'express'
import * as model from '@/models/room.model'

/**
 * room controller index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<RoomIndexRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId

  try {
    const { rooms } = await model.index(currentUserId)
    response.data = { rooms }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * room controller show
 */
const show = async (req: Request, res: Response) => {
  const response: IResponse<RoomShowRes> = {
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
 * room controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RoomCreateRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const { room } = await model.create(userId, currentUserId)
    response.data = { room }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, show, create }
