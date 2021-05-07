import { Router } from 'express'

import * as relationshipController from '@/controllers/relationship.controller'
import * as profileController from '@/controllers/profile.controller'
import * as messageController from '@/controllers/message.controller'
import * as userController from '@/controllers/user.controller'
import * as roomController from '@/controllers/room.controller'
import * as tagController from '@/controllers/tag.controller'
import { authCheck, isCurrentUser } from '@/middlewares/auth'

const router = Router()

/***************************
 *   /users
 **************************/
router.get('/api/users', userController.index)
router.get('/api/users/:id', authCheck, userController.show)
router.post('/api/users', userController.create)
router.put('/api/users/:id', authCheck, isCurrentUser, userController.update)
router.get('/api/users/:id/relationships', authCheck, relationshipController.index)
router.post('/api/users/:id/relationships', authCheck, relationshipController.create)
router.delete('/api/users/:id/relationships', authCheck, relationshipController.destroy)
router.post('/api/users/:id/rooms', authCheck, roomController.create)

/***************************
 *   /profiles
 **************************/
router.put('/api/profiles', authCheck, isCurrentUser, profileController.update)

/***************************
 *   /rooms
 **************************/
router.get('/api/rooms', authCheck, roomController.index)
router.get('/api/rooms/:id', authCheck, roomController.show)
router.get('/api/rooms/:id/messages', authCheck, messageController.index)
router.post('/api/rooms/:id/messages', authCheck, messageController.create)

/***************************
 *   /messages
 **************************/
router.put('/api/messages/:id', authCheck, messageController.update)

/***************************
 *   /tags
 **************************/
router.get('/api/tags', tagController.index)
router.get('/api/tags/:id', tagController.show)

export default router
