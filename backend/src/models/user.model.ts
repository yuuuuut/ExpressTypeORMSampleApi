import { getManager } from 'typeorm'
import { User } from '../entities'

const index = async () => {
  const userRepository = getManager().getRepository(User)
  const users = await userRepository.find()

  return users
}

export { index }
