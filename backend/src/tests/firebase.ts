import { getManager } from 'typeorm'
import dotenv from 'dotenv'
import axios from 'axios'

import firebaseAdmin from '@/libs/firebase'
import { Profile, User } from '@/entities'
import { Req } from '@/tests/common'

/***************************
 *   Settings
 **************************/
dotenv.config()

const KEY = process.env.API_KEY
const UID = process.env.UID as string
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${KEY}`

/***************************
 *   Main
 **************************/

/**
 * @description Firebaseに存在するUser情報からUserを作成する。
 *              Profileも必要な場合は渡す。
 */
async function createFirebaseUser(profile?: Profile) {
  const userRepository = getManager().getRepository(User)
  const firebaseUser = await firebaseAdmin.auth().getUser(UID)

  const newUser = new User()
  newUser.id = firebaseUser.uid
  newUser.displayName = firebaseUser.displayName
  newUser.photoURL = firebaseUser.photoURL
  newUser.profile = profile || undefined
  const userDate = await userRepository.save(newUser)

  const user = await userRepository.findOne(userDate.id)
  if (!user) throw new Error('Test Failed')

  return user
}

/**
 * @description Auth Middleware をパスしてResponseを返す。
 * @param checkURL テストするURL。
 * @param type テストするリクエストタイプ。
 * @param data POSTまたはPUTの際に渡すData。
 * @returns Response
 */
async function authCheckMock(checkURL: string, type: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
  let response: any

  const authToken = await getCuurentUserToken()

  switch (type) {
    case 'GET':
      response = await Req.get(checkURL).set({
        Authorization: `Bearer ${authToken}`,
      })
      break
    case 'POST':
      response = await Req.post(checkURL)
        .set({ Authorization: `Bearer ${authToken}` })
        .send(data)
      break
    case 'PUT':
      response = await Req.put(checkURL)
        .set({ Authorization: `Bearer ${authToken}` })
        .send(data)
      break
    case 'DELETE':
      response = await Req.delete(checkURL).set({
        Authorization: `Bearer ${authToken}`,
      })
      break
  }

  return response
}

/**
 * @description Firebaseに保存されているUserの有効なTokenを返す。
 */
async function getCuurentUserToken() {
  const token = await firebaseAdmin.auth().createCustomToken(UID)
  const tokenRes = await axios({
    method: 'POST',
    url,
    data: {
      token: token,
      returnSecureToken: true,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await tokenRes.data.idToken
}

export { createFirebaseUser, authCheckMock }
