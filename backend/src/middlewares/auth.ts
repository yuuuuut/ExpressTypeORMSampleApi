import { Response, Request, NextFunction } from 'express'
import firebase from '@/libs/firebase'

//ExpressのRequestの型にcurrentUserIdを追加する。
declare global {
  namespace Express {
    interface Request {
      currentUserId: string
    }
  }
}

/**
 * Tokenが存在するか、有効なTokenかチェックする。
 */
async function authCheck(req: Request, res: Response, next: NextFunction) {
  const bearToken = req.headers['authorization']
  if (!bearToken) return res.status(401).json({ message: 'Tokenが存在しません。' })

  const bearer = bearToken.split(' ')
  const token = bearer[1]

  try {
    const decoded = await firebase.auth().verifyIdToken(token)
    req.currentUserId = decoded.uid
    next()
  } catch (err) {
    res.status(403).json({ message: err })
  }
}

export default authCheck
