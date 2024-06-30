import express from 'express'
import {
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
} from '../controllers/teacherControllers.js'

const router = express.Router()

router.route('/').get(getAllTeachers).post(createTeacher)

router
    .route('/:id')
    .get(getTeacherById)
    .patch(updateTeacher)
    .delete(deleteTeacher)

export default router
