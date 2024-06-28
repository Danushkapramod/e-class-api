import express from 'express'
import { createTeacher, getAllTeachers, getTeacherById } from '../controllers/teacherControllers.js'


const router = express.Router()

router.route('/').get(getAllTeachers).post(createTeacher)

router.route('/:id').get(getTeacherById).patch().delete()

export default router
