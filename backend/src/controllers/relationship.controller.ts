import { Request, Response } from 'express'

import * as userModel from '../models/user.model'

/**
 * @description Relationship Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipIndexRes> = {
    status: 200,
  }
  const userId = req.params.id

  try {
    const followings = await userModel.followings(userId)
    const followers = await userModel.followers(userId)
    response.data = { followings, followers }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * @description Relationship Controller Create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipCreateRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    await userModel.follow(userId, currentUserId)
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
 * @description Relationship Controller Destroy
 */
const destroy = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipDestroyRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    await userModel.unfollow(userId, currentUserId)
    response.data = {
      message: 'フォローを解除しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index, create, destroy }
