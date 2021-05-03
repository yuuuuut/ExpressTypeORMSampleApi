import { getManager } from 'typeorm'

import { Tag } from '@/entities'

/**
 * @description Tagの配列を返します。
 */
const index = async () => {
  const tagRepository = getManager().getRepository(Tag)

  const tags = await tagRepository.find()

  return tags
}

export { index }
