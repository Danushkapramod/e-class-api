import express from 'express'

import { protect } from '../controllers/authController.js'
import { createStudent, deleteStudent, getStudents, updateStudent } from '../controllers/studentControllers.js'

const router = express.Router()

router.route('/').get(protect,getStudents).post(protect,createStudent)
router.route('/:id').patch(protect,updateStudent).delete(protect,deleteStudent)

export default router
