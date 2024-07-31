import express from 'express'

import { protect } from '../controllers/authController.js'
import { createStudent, deleteSelectedStudents, deleteStudent, getStudents,
     studentsTotal,
     updateSelectedStudents, updateStudent } from '../controllers/studentControllers.js'

const router = express.Router()

router.route('/').get(protect,getStudents).post(protect,createStudent)
router.route('/:id').patch(protect,updateStudent).delete(protect,deleteStudent)
router.route('/deleteMany').post(protect,deleteSelectedStudents)
router.route('/updateMany').post(protect,updateSelectedStudents)
router.route('/total').get(protect,studentsTotal)

export default router
