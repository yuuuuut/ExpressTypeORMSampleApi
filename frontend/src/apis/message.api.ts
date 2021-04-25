import { AxiosResponse } from 'axios'
import { Axios } from './axios'

/***************************
 *   Types
 **************************/
interface MessageIndexRes {
  messages: Message[]
}

interface MessageCreateRes {
  message: Message
}

/***************************
 *   Apis
 **************************/

/**
 * message index api
 */
const index = async (
  roomId: string,
  token: string
): Promise<AxiosResponse<IResponse<MessageIndexRes>>> => {
  const response = (await Axios.get(`/rooms/${roomId}/messages`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse<IResponse<MessageIndexRes>>

  return response
}

/**
 * message create api
 */
const create = async (
  roomId: string,
  type: Message['kind'],
  token: string
): Promise<AxiosResponse<IResponse<MessageCreateRes>>> => {
  const data = {
    kind: type,
  }

  const response = (await Axios.post(`/rooms/${roomId}/messages`, data, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse<IResponse<MessageCreateRes>>

  return response
}

export { index, create }
