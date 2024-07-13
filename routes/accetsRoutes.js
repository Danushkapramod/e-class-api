import express from 'express'
import { exportClassCvs, exportClassPdf } from '../controllers/accetControllers.js'

const router = express.Router()

router.get('/cvs/get', exportClassCvs)
router.get('/pdf/get', exportClassPdf)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
