import { AxiosResponse } from 'axios'
import { Axios } from './axios'

/**
 * User を作成する。
 */
export const create = async (
  user: User
): Promise<AxiosResponse<IResponse<User>>> => {
  const userData: User = {
    id: user.id,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }

  const response: AxiosResponse<IResponse<User>> = await Axios.post(
    '/users',
    userData
  )

  return response
}
