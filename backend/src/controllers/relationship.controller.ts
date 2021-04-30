import { Request, Response } from 'express'

import {
  IResponse,
  RelationshipCreateApiRes,
  RelationshipDestroyApiRes,
  RelationshipFollowersApiRes,
  RelationshipFollowingsApiRes,
} from '../types'

import { getCuurentUser } from '../models/common.model'
import * as userModel from '../models/user.model'

/**
 * relationship controlelr followings
 */
const followings = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipFollowingsApiRes> = {
    status: 200,
  }
  const userId = req.params.id

  try {
    const followings = await userModel.followings(userId)
    response.data = { followings }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * relationship controlelr followers
 */
const followers = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipFollowersApiRes> = {
    status: 200,
  }
  const userId = req.params.id

  try {
    const followers = await userModel.followers(userId)
    response.data = { followers }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

/**
 * relationship controller create
 */
const create = async (req: Request, res: Response) => {
  const response: IResponse<RelationshipCreateApiRes> = {
    status: 201,
  }
  const currentUserId = req.currentUserId
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    await userModel.follow(userId, currentUser)
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
  const userId = req.params.id

  try {
    const currentUser = await getCuurentUser(currentUserId)
    await userModel.unfollow(userId, currentUser)
    response.data = {
      message: 'フォローを解除しました。',
    }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { followings, followers, create, destroy }
