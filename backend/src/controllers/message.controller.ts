import { Request, Response } from 'express'

import { IResponse, MessageCreateApiReq, MessageCreateApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as messageModel from '../models/message.model'

/**
 * message controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<MessageCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const roomId = req.params.id
  const body = req.body as MessageCreateApiReq

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const data = await messageModel.create(body, roomId, currentUser)
    response.data = {
      message: data.message,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { create }
