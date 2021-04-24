import { AxiosResponse } from 'axios'
import { Axios } from './axios'

/***************************
 *   Types
 **************************/
interface RoomShowRes {
  room: Room
}

interface RoomCreateRes {
  room: Room
  currentUserEntry: Entry
  userEntry: Entry
}

/***************************
 *   Apis
 **************************/

/**
 * room show api
 */
const show = async (
  id: string,
  token: string
): Promise<AxiosResponse<IResponse<RoomShowRes>>> => {
  const response = (await Axios.get(`/rooms/${id}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse<IResponse<RoomShowRes>>

  return response
}

/**
 * room create api
 */
const create = async (
  id: string,
  token: string
): Promise<AxiosResponse<IResponse<RoomCreateRes>>> => {
  const response = (await Axios.post(
    `/users/${id}/rooms`,
    {},
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
  )) as AxiosResponse<IResponse<RoomCreateRes>>

  return response
}

export { show, create }
