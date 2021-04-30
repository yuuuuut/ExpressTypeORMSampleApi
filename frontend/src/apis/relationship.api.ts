import { AxiosResponse } from 'axios'
import { Axios } from './axios'

const followings = async (id: string, token: string): Promise<AxiosResponse> => {
  const response = (await Axios.get(`users/${id}/followers`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse

  return response
}

/**
 * relationship create api
 */
const create = async (id: string, token: string): Promise<AxiosResponse> => {
  const response = (await Axios.post(
    `users/${id}/follow`,
    {},
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    }
  )) as AxiosResponse

  return response
}

const unfollow = async (id: string, token: string): Promise<AxiosResponse> => {
  const response = (await Axios.delete(`users/${id}/unfollow`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })) as AxiosResponse

  return response
}

export { followings, create, unfollow }
