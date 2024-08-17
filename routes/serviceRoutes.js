import express from 'express'
import { driveOauthSignup } from '../controllers/serviceControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.post('/drive-oauth-signup',protect,driveOauthSignup)
//router.get('/drive-oauth-info',protect, exportStudentCvs)

export default router
