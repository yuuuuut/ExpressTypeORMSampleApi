import { Router } from 'express'

import * as userApiController from '../controllers/apis/user.api.controller'
import * as profileController from '../controllers/profile.controller'
import { index } from '../controllers/user.controller'
import authCheck from '../middlewares/auth'

const router = Router()

router.get('/api/users', authCheck, index)

router.post('/api/users', userApiController.create)

router.put('/api/profiles', authCheck, profileController.update)

export default router
