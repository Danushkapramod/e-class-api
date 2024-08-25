import express from 'express'
import {
    changeEmail,
    changePassword,
    emailChangePin,
    fetchAuthData,
    forgotPassword,
    login,
    logOut,
    protect,
    resetPassword,
    signup,
    updateAuther,
    updateUserAvatar,
    verifyEmail,
} from '../controllers/authController.js'
import { uploadBuffer } from '../configs/multer.js'
import { getAppSetings, statusOptionsDefault, updateAppSetings } from '../controllers/appSetingsController.js'

const router = express.Router()

router.post('/signup', signup ) 
router.get('/verify-email',verifyEmail)
router.post('/login', login)
router.post('/reset-password',resetPassword)
router.post('/forgot-password',forgotPassword)
router.post('/change-password',protect,changePassword)
router.patch("/me/update",protect,updateAuther)
router.patch("/me/update-avatar",protect,uploadBuffer,updateUserAvatar)
router.post('/logout',protect,logOut)
router.post('/change-email-token', protect, emailChangePin)
router.post('/change-email', protect, changeEmail)
router.get('/me', protect, fetchAuthData)
router.route('/app-settings').get( protect, getAppSetings).patch(protect,updateAppSetings)
router.post('/default-statusOptions',protect,statusOptionsDefault)
export default router



