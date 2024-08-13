import express from 'express'

import { protect } from '../controllers/authController.js'
import { createStudent, deleteSelectedStudents, deleteStudent, getAllStudents, getStudents,
     studentsTotal,
     updateSelectedStudents, updateStudent } from '../controllers/studentControllers.js'

const router = express.Router()

router.route('/').get(protect,getAllStudents).post(protect,createStudent)
router.route('/deleteMany').post(protect,deleteSelectedStudents)
router.route('/updateMany').post(protect,updateSelectedStudents)
router.route('/total/:id').get(protect,studentsTotal)
router.route('/:id').get(protect,getStudents).patch(protect,updateStudent).delete(protect,deleteStudent)

export default router
