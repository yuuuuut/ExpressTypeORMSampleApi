import { Request, Response } from 'express'

import { IResponse, TagIndexRes } from '@/types'
import * as model from '@/models/tag.model'

/**
 * @description Tag Controller Index
 */
const index = async (req: Request, res: Response) => {
  const response: IResponse<TagIndexRes> = {
    status: 200,
  }

  try {
    const tags = await model.index()
    response.data = { tags }
  } catch (err) {
    response.status = err.status || 500
    response.error = { message: err.message }
  }

  return res.status(response.status).json(response)
}

export { index }
