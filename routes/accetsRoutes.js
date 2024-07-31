import express from 'express'
import { deleteFile, exportClassCvs, exportClassPaymentSheetPdf, exportClassPdf, exportStudentCvs, exportStudentPdf,
     exportTeacherCvs,  exportTeacherPdf,  getSignedAwsUrl } from '../controllers/accetControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.get('/classes-csv/get',protect, exportClassCvs)
router.get('/classes-pdf/get', protect,exportClassPdf)

router.get('/teachers-csv/get',protect, exportTeacherCvs)
router.get('/teachers-pdf/get',protect, exportTeacherPdf)

router.get('/students-csv/get',protect, exportStudentCvs)
router.get('/students-pdf/get',protect, exportStudentPdf)
router.get('/paymentsSheet-pdf/get',protect, exportClassPaymentSheetPdf)


router.post('/awsSignedUrl', getSignedAwsUrl)
router.post('/delete', deleteFile)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
