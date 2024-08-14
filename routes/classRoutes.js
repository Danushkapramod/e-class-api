import express from 'express'

import {
    classesTotal,
    createClass,
    deleteClass,
    getAllClasses,
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
router.patch('/hide',protect,hideClass)
router.route('/:id').get(protect,getClassById).patch(protect,uploadBuffer,updateClass).delete(protect,deleteClass)

export default router
