import { EntityManager, getRepository } from 'typeorm'
import { Notification, User } from '@/entity'

//const notificationRepository = () => getRepository(Notification)

/**
 * notification model create
 */
const create = async (visiter: User, visited: User, action: Notification['action'], em: EntityManager) => {
  const notification = em.create(Notification, {
    action,
    visiter,
    visited,
  })

  return await em.save(notification)
}

export { create }
