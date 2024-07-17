import express from 'express'
import { deleteFile, exportClassCvs, exportClassPdf, exportTeacherCvs, exportTeacherPdf, getSignedAwsUrl } from '../controllers/accetControllers.js'

const router = express.Router()

router.get('/classes-csv/get', exportClassCvs)
router.get('/classes-pdf/get', exportClassPdf)

router.get('/teachers-csv/get', exportTeacherCvs)
router.get('/teachers-pdf/get', exportTeacherPdf)

router.post('/awsSignedUrl', getSignedAwsUrl)
router.post('/delete', deleteFile)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
