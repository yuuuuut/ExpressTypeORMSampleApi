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
