import { getManager, In } from 'typeorm'

import { Tag } from '@/entities'

/**
 * tag model index
 */
const index = async () => {
  const tagRepository = getManager().getRepository(Tag)

  const tags = await tagRepository.find()

  return tags
}

/**
 * tag model show
 */
const show = async (tagId: string) => {
  const tagRepository = getManager().getRepository(Tag)

  const tag = await tagRepository.findOne(tagId, {
    relations: ['users', 'users.tags'],
  })
  if (!tag) throw Object.assign(new Error('Tagが存在しません。'), { status: 404 })

  return tag
}

/**
 * 戻り値のidsからTagを取得します。
 * @param ids TgaのIDの配列
 */
const updateUserGetTags = async (ids: number[]) => {
  const tagRepository = getManager().getRepository(Tag)

  const tags = await tagRepository.find({
    where: { id: In(ids) },
  })

  return tags
}

export { index, show, updateUserGetTags }
