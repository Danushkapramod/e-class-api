import express from 'express'
import {  backupClasses, backupClassPayments, backupStudents, backupTeachers, driveOauthSignup, getBackupAccount } from '../controllers/serviceControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.post('/drive-oauth-signup',protect,driveOauthSignup)
router.get('/drive-backup-classpayments',protect,backupClassPayments)
router.get('/drive-backup-students',protect,backupStudents)
router.get('/drive-backup-teachers',protect,backupTeachers)
router.get('/drive-backup-classes',protect,backupClasses)
router.get('/drive-account',protect,getBackupAccount)
//router.get('/drive-oauth-info',protect, exportStudentCvs)

export default router
