import { Request, Response } from 'express'

import * as model from '@/models/message.model'

/**
 * @description Message Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<MessageIndexRes> = {
    status: 200,
  }
  const roomId = req.params.id

  try {
    const { messages } = await model.index(roomId)
    response.data = { messages }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description Message Controller Create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<MessageCreateRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const roomId = req.params.id
  const body = req.body as MessageCreateReq

  try {
    const { message } = await model.create(body, roomId, currentUserId)
    response.data = { message }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description Message Controller Update
 */
const update = async (req: Request, res: Response) => {
  const response: IResponse<MessageUpdateRes> = {
    status: 201,
  }
  const messageId = req.params.id
  const body = req.body as MessageUpdateReq

  try {
    const message = await model.update(body, messageId)
    response.data = { message }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, create, update }
