import express from 'express'
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getTeacherById,
    teacherTotal,
    updateTeacher,
} from '../controllers/teacherControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.route('/').get(protect,getAllTeachers).post(protect,createTeacher)
router.get('/total',protect,teacherTotal)
router
    .route('/:id')
    .get(getTeacherById)
    .patch(protect,updateTeacher)
    .delete(protect,deleteTeacher)

export default router
