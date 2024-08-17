import express from 'express'
import { deleteFile, exportClassCvs, exportClassPaymentSheetPdf, exportClassPaymentsSheetFilledPdf, exportClassPaymentsSheetFilledPdfBuffer, exportClassPdf, exportStudentCvs, exportStudentPdf,
     exportTeacherCvs,  exportTeacherPdf,  getSignedAwsUrl } from '../controllers/accetControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.post('/classes-csv/get',protect, exportClassCvs)
router.post('/classes-pdf/get', protect,exportClassPdf)

router.post('/teachers-csv/get',protect, exportTeacherCvs)
router.post('/teachers-pdf/get',protect, exportTeacherPdf)

router.post('/students-csv/get/:id',protect, exportStudentCvs)
router.post('/students-pdf/get/:id',protect, exportStudentPdf)
router.post('/paymentsSheet-pdf/get/:id',protect, exportClassPaymentSheetPdf)
router.post('/paymentsSheetFilled-pdf/get/:id',protect, exportClassPaymentsSheetFilledPdfBuffer)


router.post('/awsSignedUrl', getSignedAwsUrl)
router.post('/delete', deleteFile)
//router.post('/login', login)
//router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

//router.get('/', protect, getAllUsers)
//router.get('/me', protect, fetchAuthData)
export default router
