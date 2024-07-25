import express from 'express'

import { protect } from '../controllers/authController.js'
import { createStudent, getStudents } from '../controllers/studentControllers.js'

const router = express.Router()

router.route('/').get(protect,getStudents).post(protect,createStudent)


export default router
