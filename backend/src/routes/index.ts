import { Router } from 'express'

import { index } from '../controllers/user.controller'
import authCheck from '../middlewares/auth'

const router = Router()

router.get('/api/users', authCheck, index)

export default router
