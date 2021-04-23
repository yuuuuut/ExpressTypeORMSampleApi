import { Request, Response } from 'express'

import { IResponse, ProfileUpdateApiReq, ProfileUpdateApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as model from '../models/profile.model'

/**
 * profile controller update
 */
const update = async (req: Request, res: Response) => {
  const response: IResponse<ProfileUpdateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const body = req.body as ProfileUpdateApiReq

  try {
    const currentUser = await getCuurentUser(currentUserId)
    const profile = await model.update(currentUser, body)
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
