import { getRepository, In } from 'typeorm'
import { getOneTag } from './common.model'
import { Tag } from '@/entity'

const tagRepository = () => getRepository(Tag)

/**
 * tag model index
 */
const index = async () => {
  const tags = await tagRepository().find()

  return tags
}

/**
 * tag model show
 */
const show = async (tagId: string) => {
  const tag = await getOneTag(tagId, { relations: ['users', 'users.tags'] })

  return tag
}

/**
 * 戻り値のidsからTagを取得します。
 */
const updateUserGetTags = async (ids: number[]) => {
  const tags = await tagRepository().find({
    where: { id: In(ids) },
  })

  return tags
}

export { index, show, updateUserGetTags }
