import { Request, Response } from 'express'

import {
  IResponse,
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
} from '../types'
import * as model from '../models/relationship.model'
import { getCuurentUser } from '../models/common.model'

/**
 * relationship controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const id = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    await model.create(id, currentUser)
    response.data = {
      message: 'フォローしました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * relationship controller destroy
 */
const destroy = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipDestroyApiRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const id = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    await model.destroy(id, currentUser)
    response.data = {
      message: 'フォローを解除しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { create, destroy }
