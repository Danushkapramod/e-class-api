import express from 'express'

import { protect } from '../controllers/authController.js'
import { createStudent, deleteManyStudents, deleteStudent, getAllStudents, getHiddenStudents, getStudents,
     hideStudent,
     studentsTotal,
     studentsTotalAll,
     updateSelectedStudents, updateStudent } from '../controllers/studentControllers.js'

const router = express.Router()

router.route('/').get(protect,getAllStudents).post(protect,createStudent)
router.route('/deleteMany').post(protect,deleteManyStudents)
router.route('/updateMany').post(protect,updateSelectedStudents)
router.get('/hidden',protect,getHiddenStudents)
router.patch('/hide',protect,hideStudent)
router.route('/total').get(protect,studentsTotalAll)
router.route('/total/:id').get(protect,studentsTotal)
router.route('/:id').get(protect,getStudents).patch(protect,updateStudent).delete(protect,deleteStudent)

export default router
