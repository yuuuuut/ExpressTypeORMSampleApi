import { Entry, Message, Profile, Room, User } from './entities'

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
}

export interface UserCreateApiReq {
  id: User['id']
  displayName: User['displayName']
  photoURL: User['photoURL']
}

export interface UserCreateApiRes {
  user: User
  profile: Profile | null
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

export interface RelationshipCreateApiRes {
  message: string
}

export interface RelationshipDestroyApiRes {
  message: string
}

export interface RoomShowApiRes {
  room: Room
  otherEntry: {
    id: Entry['id']
    user: Entry['user']
  }
}

export interface RoomCreateApiRes {
  room: Room
  currentUserEntry: Entry
  userEntry: Entry
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
