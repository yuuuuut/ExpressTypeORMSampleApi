import { Router } from 'express'

import { create } from '../controllers/apis/user.api.controller'
import { index } from '../controllers/user.controller'
import authCheck from '../middlewares/auth'

const router = Router()

router.get('/api/users', authCheck, index)

router.post('/api/users', create)

export default router
