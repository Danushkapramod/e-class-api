import express from 'express'
import {
    getAllUsers,
    login,
    protect,
    signup,
} from '../controllers/authController.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
// router.post("/forgotPassword")
// router.patch("/resetPassword/:token")

router.get('/', protect, getAllUsers)

export default router
