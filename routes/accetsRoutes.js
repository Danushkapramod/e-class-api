import express from 'express'
import { deleteFile, exportClassCvs, exportClassPdf, exportTeacherCvs, exportTeacherPdf, getSignedAwsUrl } from '../controllers/accetControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.get('/classes-csv/get',protect, exportClassCvs)
router.get('/classes-pdf/get', protect,exportClassPdf)

router.get('/teachers-csv/get',protect, exportTeacherCvs)
router.get('/teachers-pdf/get',protect, exportTeacherPdf)

router.post('/awsSignedUrl', getSignedAwsUrl)
router.post('/delete', deleteFile)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
