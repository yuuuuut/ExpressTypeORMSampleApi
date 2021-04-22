import { Request, Response } from 'express'

import { IResponse, RelationshipCreateApiRes } from '../commons/types'
import * as model from '../models/relationship.model'

/**
 * RelationshipCreate
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipCreateApiRes> = {
    status: 201,
  }

  try {
    await model.create(req)
    response.data = {
      message: 'フォローしました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { create }
