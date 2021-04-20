import { Request, Response } from 'express'

import { IResponse } from '../../commons/response'
import { User } from '../../entities'
import * as model from '../../models/user.model'

export const create = async (req: Request, res: Response) => {
  const response: IResponse<{ user: User }> = {
    status: 201,
    success: true,
  }

  try {
    const user = await model.create(req)
    response.data = { user: user }
  } catch (err) {
    response.status = err.status || 500
    response.success = false
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}
