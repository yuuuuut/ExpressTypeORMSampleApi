import { getManager } from 'typeorm'

import { User } from '../entities'

/**
 * CurrentUserを取得して存在する場合は返します。
 */
const getCuurentUser = async (currentUserId: string) => {
  const userRepository = getManager().getRepository(User)
  const currentUser = await userRepository.findOne(currentUserId)
  if (!currentUser)
    throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return currentUser
}

export { getCuurentUser }
