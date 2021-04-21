import { Request, Response } from 'express'
import { IResponse, ProfileUpdateApiRes } from '../commons/types'

import * as model from '../models/profile.model'

const update = async (req: Request, res: Response) => {
  const response: IResponse<ProfileUpdateApiRes> = {
    status: 201,
  }

  const currentUserId = req.currentUserId

  try {
    const profile = await model.update(req, currentUserId)
    response.data = {
      profile: profile,
      message: 'プロフィールの更新に成功しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { update }
