import { Request, Response } from 'express'

import { IResponse, RoomCreateApiRes } from '../types'
import * as roomModel from '../models/room.model'

/**
 * room controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RoomCreateApiRes> = {
    status: 201,
  }

  try {
    const data = await roomModel.create()
    response.data = {
      room: data.room,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { create }
