import { getManager } from 'typeorm'
import { User } from '@/entities'

/**
 * Userを返します。
 * @param userId ユーザーのID
 * @param relations リレーションを示すstringの配列
 */
async function getUser(userId: string, relations?: string[]) {
  let currentUser: User | undefined

  const userRepository = getManager().getRepository(User)

  if (relations) {
    currentUser = await userRepository.findOne(userId, {
      relations: relations,
    })
  } else {
    currentUser = await userRepository.findOne(userId)
  }

  if (!currentUser) throw Object.assign(new Error('ユーザーが存在しません。'), { status: 404 })

  return currentUser
}

export { getUser }
