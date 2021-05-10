import { Message, Profile, Room, Tag, User } from '@/entity'

declare global {
  namespace Express {
    interface Request {
      currentUserId: string
    }
  }

  interface IResponse<T> {
    status: number
    data?: T
    error?: {
      message?: string
    }
  }

  interface TestIResponse<T> {
    status: number
    body: {
      data: T
      error?: {
        message?: string
      }
    }
  }

  interface UserIndexRes {
    users: User[]
  }

  interface UserShowRes {
    user: User
    isFollowing: boolean | undefined
    isMutualFollow: boolean | undefined
    isRoom: boolean | undefined
    roomId: string | undefined
  }

  interface UserCreateReq {
    id: User['id']
    displayName: User['displayName']
    photoURL: User['photoURL']
  }

  interface UserCreateRes {
    user: User
    isCreate: boolean
  }

  interface UserUpdateReq {
    tagIds: number[]
  }

  interface UserUpdateRes {
    user: User
    message: string
  }

  interface ProfileUpdateReq {
    lineId: Profile['lineId']
    twitterId: Profile['twitterId']
  }

  interface ProfileUpdateRes {
    profile: Profile
    message: string
  }

  interface RelationshipIndexRes {
    followings: User[]
    followers: User[]
  }

  interface RelationshipCreateRes {
    message: string
  }

  interface RelationshipDestroyRes {
    message: string
  }

  interface RoomIndexRes {
    rooms: Room[]
  }

  interface RoomShowRes {
    room: Room
  }

  interface RoomCreateRes {
    room: Room
  }

  interface MessageCreateReq {
    kind: Message['kind']
  }

  interface MessageIndexRes {
    messages: Message[]
  }

  interface MessageCreateRes {
    message: Message
  }

  interface MessageUpdateReq {
    type: 'IS_APPROVAL' | 'REJECTED'
  }

  interface MessageUpdateRes {
    message: Message
  }

  interface TagIndexRes {
    tags: Tag[]
  }

  interface TagShowRes {
    tag: Tag
  }
}
