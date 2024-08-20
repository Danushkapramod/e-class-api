import express from 'express'

import {
    classesTotal,
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


const router = express.Router()

router.route('/').get(protect,getAllClasses).post(protect,uploadBuffer,createClass)
router.get('/hidden',protect,getHiddenClasses)
router.route('/total').get(protect,classesTotal)
router.route('/deleteMany').post(protect,deleteManyClasses)
router.patch('/hide',protect,hideClass)
router.route('/:id').get(protect,getClassById).patch(protect,uploadBuffer,updateClass).delete(protect,deleteClass)

router.route('/attendance').post(protect,createAttendance)
router.route('/attendance/:id').get(protect,getAttendances)

export default router
