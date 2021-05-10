import { getManager } from 'typeorm'
import request from 'supertest'
import dotenv from 'dotenv'
import axios from 'axios'

import { Message, Profile, Room, Tag, User } from '@/entity'
import firebaseAdmin from '@/lib/firebase'

/***************************
 *   Settings
 **************************/
dotenv.config()

export const Req = request('http://localhost:4000/api')

const KEY = process.env.API_KEY
const UID = process.env.UID as string
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${KEY}`

/***************************
 *   Main
 **************************/

/**
 * TestUser取得する。
 */
export async function getTestUser(userId: string) {
  const userRepository = getManager().getRepository(User)

  const user = await userRepository.findOne(userId, {
    relations: ['rooms'],
  })
  if (!user) throw new Error('Test Failed None User')

  return user
}

/**
 * Test用Userを作成する。
 */
export async function createTestUser(userId?: string) {
  const userRepository = getManager().getRepository(User)

  const newUser = new User()
  newUser.id = userId || 'TestUser'
  newUser.displayName = 'TestDisName'
  newUser.photoURL = 'TestUserPhoto'

  const userData = await userRepository.save(newUser)

  const user = await userRepository.findOne(userData.id)
  if (!user) throw new Error('Test Failed: createTestUser')

  return user
}

/**
 * UserにProfileを追加する。
 */
export async function addProfileTestUser(user: User, profile: Profile) {
  user.profile = profile

  return await user.save()
}

/**
 * UserにTagを追加する。
 */
export async function addTagTestUser(user: User, tags: Tag[]) {
  user.tags = tags

  return await user.save()
}

/**
 * Test用Profileを作成する。
 */
export async function createTestProfile() {
  const profileRepository = getManager().getRepository(Profile)

  const profile = new Profile()

  return await profileRepository.save(profile)
}

/**
 * Test用Relationshipを作成する。
 */
export async function createTestRelationship(currentUserId: string, userId: string) {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId, {
    relations: ['followings', 'followers'],
  })
  if (!currentUser) throw new Error('Test Failed: createTestRelationship')

  const user = await userRepository.findOne(userId, {
    relations: ['followings', 'followers'],
  })
  if (!user) throw new Error('Test Failed: createTestRelationship')

  user.followers.push(currentUser)
  await user.save()
}

/**
 * Test用Roomを作成する。
 */
export async function createTestRoom(user: User, currentUser: User) {
  const roomRepository = getManager().getRepository(Room)

  const room = new Room()
  room.id = 'TestRoom'
  room.users = [user, currentUser]

  return await roomRepository.save(room)
}

/**
 * Test用Messageを作成する。
 */
export async function createTestMessage(user: User, room: Room) {
  const messageRepository = getManager().getRepository(Message)

  const message = new Message()
  message.kind = 'LINE'
  message.user = user
  message.room = room

  return await messageRepository.save(message)
}

/**
 * Test用Tagを作成する。
 */
export async function createTestTag(name: string) {
  const newTag = new Tag()

  newTag.name = name

  return await newTag.save()
}

/**
 * Firebaseに存在するUser情報からUserを作成する。
 * Profileも必要な場合は渡す。
 */
export async function createFirebaseUser() {
  const userRepository = getManager().getRepository(User)
  const firebaseUser = await firebaseAdmin.auth().getUser(UID)

  const newUser = new User()
  newUser.id = firebaseUser.uid
  newUser.displayName = firebaseUser.displayName
  newUser.photoURL = firebaseUser.photoURL
  const userDate = await userRepository.save(newUser)

  const user = await userRepository.findOne(userDate.id)
  if (!user) throw new Error('Test Failed')

  return user
}

/**
 * Auth Middleware をパスしてResponseを返す。
 */
export async function authCheckMock(checkURL: string, type: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
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
 * Firebaseに保存されているUserの有効なTokenを返す。
 */
export async function getCuurentUserToken() {
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
