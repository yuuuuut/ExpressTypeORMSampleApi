import { Request } from 'express'
import { getManager } from 'typeorm'
import { Relationship, User } from '../entities'

/**
 * Relationship model create
 */
const create = async (req: Request) => {
  const relationshipRepository = getManager().getRepository(Relationship)
  const userRepository = getManager().getRepository(User)

  const currentUserId = req.currentUserId

  const currentUser = await userRepository.findOne(currentUserId)
  const followUser = await userRepository.findOne(req.params.id)
  if (!followUser || !currentUser) throw new Error('Userが存在しません。')

  const relationship = new Relationship()
  relationship.user = currentUser
  relationship.follow = followUser

  await relationshipRepository.save(relationship)
}

export { create }
