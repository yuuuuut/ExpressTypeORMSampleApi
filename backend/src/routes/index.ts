import { Router } from 'express'
import { index } from '../controllers/user.controller'

const router = Router()

router.get('/api/users', index)

export default router
