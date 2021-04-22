import { Profile, User } from '../entities'

export interface IResponse<T> {
  status: number
  data?: T
  error?: {
    message?: string
  }
}

export interface TestIResponse<T> {
  status: number
  body: { data: T }
}

export interface UserIndexApiRes {
  users: User[]
}

export interface UserCreateApiRes {
  user: User
  profile: Profile | null
  isCreate: boolean
}

export interface ProfileUpdateApiRes {
  profile: Profile
  message: string
}

export interface RelationshipCreateApiRes {
  message: string
}
