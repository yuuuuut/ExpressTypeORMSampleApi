interface IResponse<T> {
  status: number
  data?: T
  error?: {
    message?: string
  }
}

interface User {
  id: string
  displayName: string | undefined
  photoURL: string | undefined
}

interface Room {
  id: string
  entries: Entry[]
}

interface Entry {
  id: number
  user: User
  room: Room
}

interface Message {
  id: number
  kind: 'LINE' | 'TWITTER'
  isApproval: boolean
  rejected: boolean
  user: User
  room: Room
}
