import express from 'express'
import { deleteFile, getSignedAwsUrl } from '../controllers/accetControllers.js'

const router = express.Router()

router.post('/upload', getSignedAwsUrl)
router.post('/delete', deleteFile)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
