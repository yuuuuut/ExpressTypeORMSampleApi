import { Router } from 'express'

import * as relationshipController from './controllers/relationship.controller'
import * as profileController from './controllers/profile.controller'
import * as messageController from './controllers/message.controller'
import * as userController from './controllers/user.controller'
import * as roomController from './controllers/room.controller'
import authCheck from './middlewares/auth'

const router = Router()

/***************************
 *    /users
 **************************/
router.get('/api/users', userController.index)
router.get('/api/users/:id', authCheck, userController.show)
router.post('/api/users', userController.create)
router.post('/api/users/:id/follow', authCheck, relationshipController.create)
// prettier-ignore
router.delete('/api/users/:id/unfollow', authCheck, relationshipController.destroy)
router.post('/api/users/:id/rooms', authCheck, roomController.create)

/***************************
 *    /profiles
 **************************/
router.put('/api/profiles', authCheck, profileController.update)

/***************************
 *    /rooms
 **************************/
router.get('/api/rooms/:id', authCheck, roomController.show)
router.post('/api/rooms/:id/messages', authCheck, messageController.create)

export default router
