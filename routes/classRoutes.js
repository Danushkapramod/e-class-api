import express from 'express'
import {
    createClass,
    deleteClass,
    getAllClasses,
    getClassById,
    updateClass,
} from '../controllers/classControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.route('/').get(getAllClasses).post(createClass)

router.route('/:id').get(getClassById).patch(protect,updateClass).delete( protect,deleteClass)

export default router
