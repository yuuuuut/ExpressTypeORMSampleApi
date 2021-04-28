import { Request, Response } from 'express'

import { IResponse, RoomCreateApiRes, RoomShowApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as roomModel from '../models/room.model'

/**
 * room controller show
 */
const show = async (req: Request, res: Response) => {
  const response: IResponse<RoomShowApiRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const roomId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const { room, otherEntry } = await roomModel.show(roomId, currentUser)
    response.data = {
      room,
      otherEntry,
    }
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
  const response: IResponse<RoomCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const { room, currentUserEntry, userEntry } = await roomModel.create(userId, currentUser)
    response.data = {
      room,
      currentUserEntry,
      userEntry,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { show, create }
