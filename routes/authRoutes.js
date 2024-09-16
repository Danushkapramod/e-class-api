import express from 'express'
import {
    changeEmail,
    changePassword,
    createAdmin,
    deleteAdmin,
    emailChangePin,
    fetchAuthData,
    forgotPassword,
    getAdmins,
    getHiddenAdmins,
    hideAdmin,
    login,
    logOut,
    protect,
    resetPassword,
    signup,
    updateAdmin,
    updateAuther,
    updateUserAvatar,
    verifyEmail,
} from '../controllers/authController.js'
import { uploadBuffer } from '../configs/multer.js'
import { getAppSetings, statusOptionsDefault, updateAppSetings } from '../controllers/appSetingsController.js'

const router = express.Router()

router.post('/signup', signup ) 
router.post('/admin', protect, createAdmin ) 
router.patch('/admin/:id', protect, updateAdmin ) 
router.get('/verify-email',verifyEmail)
router.get('/admins', protect, getAdmins)
router.post('/login', login)
router.get('/admins/hidden',protect,getHiddenAdmins)
router.patch('/admins/hide',protect,hideAdmin)
router.delete('/admins/:id',protect,deleteAdmin)
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



