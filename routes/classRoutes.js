import express from 'express'
import {
    classesTotal,
    createClass,
    deleteClass,
    getAllClasses,
    getClassById,
    updateClass,
} from '../controllers/classControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.route('/').get(getAllClasses).post(protect,createClass)
router.route('/total').get(classesTotal)
router.route('/:id').get(getClassById).patch(protect,updateClass).delete(protect,deleteClass)

export default router
