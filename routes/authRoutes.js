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
    verifyEmail,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.get('/verify-email',verifyEmail)
router.post('/login', login)
router.post('/reset-password',resetPassword)
router.post('/forgot-password',forgotPassword)
router.post('/change-password',protect,changePassword)
router.patch("/me/update",protect,updateAuther)
router.post('/logout',protect,logOut)
router.post('/change-email-token', protect, emailChangePin)
router.post('/change-email', protect, changeEmail)
router.get('/me', protect, fetchAuthData)
export default router
