import { Message, Profile, Room, User } from './entities'

export interface IResponse<T> {
  status: number
  data?: T
  error?: {
    message?: string
  }
}

export interface TestIResponse<T> {
  status: number
  body: {
    data: T
    error?: {
      message?: string
    }
  }
}

export interface UserIndexApiRes {
  users: User[]
}

export interface UserShowApiRes {
  user: User
  isFollowing: boolean | undefined
  isMutualFollow: boolean | undefined
  isRoom: boolean | undefined
  roomId: string | undefined
}

export interface UserCreateApiReq {
  id: User['id']
  displayName: User['displayName']
  photoURL: User['photoURL']
}

export interface UserCreateApiRes {
  user: User
  isCreate: boolean
}

export interface ProfileUpdateApiReq {
  lineId: Profile['lineId']
  twitterId: Profile['twitterId']
}

export interface ProfileUpdateApiRes {
  profile: Profile
  message: string
}

export interface RelationshipIndexApiRes {
  followings: User[]
  followers: User[]
}

export interface RelationshipCreateApiRes {
  message: string
}

export interface RelationshipDestroyApiRes {
  message: string
}

export interface RoomIndexApiRes {
  rooms: Room[]
}

export interface RoomShowApiRes {
  room: Room
}

export interface RoomCreateApiRes {
  room: Room
}

export interface MessageCreateApiReq {
  kind: Message['kind']
}

export interface MessageIndexApiRes {
  messages: Message[]
}

export interface MessageCreateApiRes {
  message: Message
}

export interface MessageUpdateApiReq {
  type: 'IS_APPROVAL' | 'REJECTED'
}

export interface MessageUpdateApiRes {
  message: Message
}
