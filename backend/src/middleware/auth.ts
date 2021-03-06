import { Response, Request, NextFunction } from 'express'
import firebase from '@/lib/firebase'

/**
 * Tokenが存在するか、有効なTokenかチェックする。
 */
async function authCheck(req: Request, res: Response, next: NextFunction) {
  const bearToken = req.headers['authorization']
  if (!bearToken) return res.status(401).json({ error: { message: 'Tokenが存在しません。' } })

  const bearer = bearToken.split(' ')
  const token = bearer[1]

  try {
    const decoded = await firebase.auth().verifyIdToken(token)
    req.currentUserId = decoded.uid
    next()
  } catch (err) {
    res.status(403).json({ error: { message: err } })
  }
}

/**
 * Requestを送ったユーザーがログインしているユーザーでない場合、
 * エラーを発生させる。
 */
async function isCurrentUser(req: Request, res: Response, next: NextFunction) {
  const currentUserId = req.currentUserId
  const id = req.params.id

  if (currentUserId !== id) {
    return res.status(403).json({ error: { message: '権限のないユーザーです。' } })
  }

  next()
}

/**
 * Requestを送ったユーザーがログインしているユーザーの場合、
 * エラーを発生させる。
 */
async function isOtherUser(req: Request, res: Response, next: NextFunction) {
  const currentUserId = req.currentUserId
  const id = req.params.id

  if (currentUserId === id) {
    return res.status(403).json({ error: { message: '権限のないユーザーです。' } })
  }

  next()
}

export { authCheck, isCurrentUser, isOtherUser }
