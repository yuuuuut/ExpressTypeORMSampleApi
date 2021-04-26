import { AxiosResponse } from 'axios'
import { Axios } from './axios'

/***************************
 *   Types
 **************************/
interface UserIndexRes {
  users: User[]
}

interface UserShowRes {
  user: User
  isFollowing: boolean
  isMutualFollow: boolean
  isRoom: boolean
  roomId: string
}

/***************************
 *   Apis
 **************************/

/**
 * user index api
 */
const index = async (): Promise<AxiosResponse<IResponse<UserIndexRes>>> => {
  const response = (await Axios.get('/users')) as AxiosResponse<
    IResponse<UserIndexRes>
  >

  return response
}

/**
 * user show api
 */
const show = async (
  id: string,
  token: string
): Promise<AxiosResponse<IResponse<UserShowRes>>> => {
  const response = (await Axios.get(`/users/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse<IResponse<UserShowRes>>

  return response
}

/**
 * user create api
 */
const create = async (user: User): Promise<AxiosResponse<User>> => {
  const userData: User = {
    id: user.id,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }

  const response = (await Axios.post('/users', userData)) as AxiosResponse<User>

  return response
}

export { index, show, create }
