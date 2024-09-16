import express from 'express'

import {
    classesTotal,
    confirmAttendance,
    confirmPayment,
    createAttendance,
    createClass,
    deleteClass,
    deleteManyClasses,
    getAllClasses,
    getAttendances,
    getClassById,
    getHiddenClasses,
    hideClass,
    updateClass,
} from '../controllers/classControllers.js'
import { protect } from '../controllers/authController.js'
import { uploadBuffer } from '../configs/multer.js'
import { canConfirmAttendence, canConfirmPayment, canDeleteClass, canUpdateClass } 
from '../controllers/permissionsControlller.js'


const router = express.Router()

router.route('/').get(protect,getAllClasses)
.post(protect, canDeleteClass, uploadBuffer,createClass)
router.get('/hidden',protect,getHiddenClasses)
router.route('/total').get(protect,classesTotal)
router.route('/deleteMany').post(protect, canDeleteClass, deleteManyClasses)
router.patch('/hide',protect, canDeleteClass, hideClass)

router.get('/confirmAttendance',protect, canConfirmAttendence, confirmAttendance)
router.get('/confirmPayment',protect, canConfirmPayment, confirmPayment)

router.route('/attendance').post(protect, canConfirmAttendence, createAttendance)
router.route('/attendance/:id').get(protect,getAttendances)

router.route('/:id').get(protect,getClassById)
.patch(protect, canUpdateClass, uploadBuffer,updateClass)
.delete(protect, canDeleteClass, deleteClass)
export default router
