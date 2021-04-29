import { AxiosResponse } from 'axios'
import { Axios } from './axios'

/***************************
 *   Types
 **************************/
interface RoomIndexRes {
  rooms: Room[]
}

interface RoomShowRes {
  room: Room
  otherEntry: {
    id: Entry['id']
    user: Entry['user']
  }
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
 * room index api
 */
const index = async (token: string): Promise<AxiosResponse<IResponse<RoomIndexRes>>> => {
  const response = (await Axios.get(`/rooms`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse<IResponse<RoomIndexRes>>

  return response
}

/**
 * room show api
 */
const show = async (id: string, token: string): Promise<AxiosResponse<IResponse<RoomShowRes>>> => {
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
const create = async (id: string, token: string): Promise<AxiosResponse<IResponse<RoomCreateRes>>> => {
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

export { index, show, create }
