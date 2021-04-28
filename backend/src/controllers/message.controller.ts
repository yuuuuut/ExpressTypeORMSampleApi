import { Request, Response } from 'express'

import {
  IResponse,
  MessageCreateApiReq,
  MessageIndexApiRes,
  MessageCreateApiRes,
  MessageUpdateApiRes,
  MessageUpdateApiReq,
} from '../types'

import { getCuurentUser } from '../models/common.model'
import * as model from '../models/message.model'

/**
 * message controller index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<MessageIndexApiRes> = {
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
    const { message } = await model.create(body, roomId, currentUser)
    response.data = { message }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * message controller update
 */
const update = async (req: Request, res: Response) => {
  const response: IResponse<MessageUpdateApiRes> = {
    status: 201,
  }
  const messageId = req.params.id
  const body = req.body as MessageUpdateApiReq

  try {
    const message = await model.update(messageId, body)
    response.data = { message }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, create, update }
