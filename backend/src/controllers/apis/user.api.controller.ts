import { Request, Response } from 'express'

import { IResponse, UserCreateApiRes } from '../../commons/types'
import * as model from '../../models/user.model'

export const create = async (req: Request, res: Response) => {
  const response: IResponse<UserCreateApiRes> = {
    status: 201,
  }

  try {
    const data = await model.create(req)
    response.data = {
      user: data.user,
      profile: data.profile,
      isCreate: data.isCreate,
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}
