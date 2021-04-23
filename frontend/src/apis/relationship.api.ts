import { AxiosResponse } from 'axios'
import { Axios } from './axios'

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

export { create }
