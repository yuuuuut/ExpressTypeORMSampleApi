import { Request, Response } from 'express'

import { IResponse, RelationshipCreateApiRes, RelationshipDestroyApiRes, RelationshipIndexApiRes } from '../types'
import { getCuurentUser } from '../models/common.model'
import * as userModel from '../models/user.model'
import redis from '@/libs/redis'

/**
 * @description Relationship Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipIndexApiRes> = {
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
  const response: IResponse<RelationshipCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    await userModel.checkTodayFollowCount(redis, userId, currentUserId)
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
  const response: IResponse<RelationshipDestroyApiRes> = {
    status: 200,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    await userModel.unfollow(userId, currentUser.id)
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
