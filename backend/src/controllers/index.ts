import { Response, Request } from 'express'

const Test = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: 'OK' })
  } catch (error) {
    throw error
  }
}

export { Test }
