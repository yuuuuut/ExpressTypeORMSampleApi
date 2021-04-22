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
  const reqId = req.params.id

  const currentUser = await userRepository.findOne(currentUserId)
  const followUser = await userRepository.findOne(reqId)
  if (!followUser || !currentUser) throw new Error('Userが存在しません。')

  const relationship = new Relationship()
  relationship.user = currentUser
  relationship.follow = followUser

  await relationshipRepository.save(relationship)
}

/**
 * Relationship model destroy
 */
const destroy = async (req: Request) => {
  const relationshipRepository = getManager().getRepository(Relationship)

  const currentUserId = req.currentUserId
  const reqId = req.params.id

  const relatinoship = await relationshipRepository.findOne({
    where: { user: currentUserId, follow: reqId },
  })
  if (!relatinoship) throw new Error('フォロー関係が存在しません。')

  await relationshipRepository.delete(relatinoship)
}

export { create, destroy }
