import { Request, Response } from 'express'

import { IResponse, RoomCreateApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as roomModel from '../models/room.model'

/**
 * room controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RoomCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const data = await roomModel.create(userId, currentUser)
    response.data = {
      room: data.room,
      currentUserEntry: data.currentUserEntry,
      userEntry: data.userEntry,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { create }
