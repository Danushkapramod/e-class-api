import express from 'express'
import {
    createTeacher,
    deleteManyTachers,
    deleteTeacher,
    getAllTeachers,
    getHiddenTeachers,
    getTeacherById,
    hideTeacher,
    teacherTotal,
    updateTeacher,
} from '../controllers/teacherControllers.js'
import { protect } from '../controllers/authController.js'
import { uploadBuffer } from '../configs/multer.js'

const router = express.Router()

router.route('/').get(protect,getAllTeachers).post(protect,uploadBuffer,createTeacher)
router.get('/total',protect,teacherTotal)
router.route('/deleteMany').post(protect,deleteManyTachers)
router.get('/hidden',protect,getHiddenTeachers)
router.patch('/hide',protect,hideTeacher)
router
    .route('/:id')
    .get(getTeacherById)
    .patch(protect,uploadBuffer,updateTeacher)
    .delete(protect,uploadBuffer,deleteTeacher)



export default router
