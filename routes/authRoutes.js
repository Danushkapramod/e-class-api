import express from 'express'
import {
    fetchAuthData,
    getAllUsers,
    login,
    protect,
    signup,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword')
// router.patch("/resetPassword/:token")

router.get('/', protect, getAllUsers)
router.get('/me', protect, fetchAuthData)
export default router
