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
