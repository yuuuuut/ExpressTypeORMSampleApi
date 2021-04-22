import { Router } from 'express'

import * as relationshipController from '../controllers/relationship.controller'
import * as profileController from '../controllers/profile.controller'
import * as userController from '../controllers/user.controller'
import authCheck from '../middlewares/auth'

const router = Router()

router.get('/api/users', userController.index)
router.post('/api/users', userController.create)
router.post('/api/users/:id/follow', authCheck, relationshipController.create)

router.put('/api/profiles', authCheck, profileController.update)

export default router
