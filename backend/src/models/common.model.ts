import { getManager } from 'typeorm'

import { User } from '../entities'

/**
 * @description CurrentUserを返します。
 * @param currentUserId CurrentUserのID。
 */
const getCuurentUser = async (currentUserId: string) => {
  const userRepository = getManager().getRepository(User)

  const currentUser = await userRepository.findOne(currentUserId)
  if (!currentUser) {
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })
  }

  return currentUser
}

export { getCuurentUser }
