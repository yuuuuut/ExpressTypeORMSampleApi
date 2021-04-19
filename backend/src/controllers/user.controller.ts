import { Request, Response } from 'express'
import { IResponse } from '../commons/response'
import { User } from '../entities'

import * as model from '../models/user.model'

export const index = async (req: Request, res: Response) => {
  const response: IResponse<{ users: User[] }> = {
    status: 200,
    success: true,
  }

  try {
    const users = await model.index()
    response.data = { users: users }
  } catch (err) {
    response.status = err.status || 500
    response.success = false
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}
