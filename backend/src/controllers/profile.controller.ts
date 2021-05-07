import { Request, Response } from 'express'

import * as model from '@/models/profile.model'

/**
 * @description Profile Controller Update
 */
const update = async (req: Request, res: Response) => {
  const response: IResponse<ProfileUpdateRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const body = req.body as ProfileUpdateReq

  try {
    const profile = await model.update(currentUserId, body)
    response.data = {
      profile,
      message: 'プロフィールの更新に成功しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { update }
