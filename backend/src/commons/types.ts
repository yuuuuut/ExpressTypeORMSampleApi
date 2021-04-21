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

export interface UserCreateApiRes {
  user: User
  profile: Profile | null
  isCreate: boolean
}
