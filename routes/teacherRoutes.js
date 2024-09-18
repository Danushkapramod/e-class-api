import express from 'express'
import {
    createTeacher,
    deleteManyTachers,
    deleteTeacher,
    getAllTeachers,
    getHiddenTeachers,
    getTeacherById,
    getTeacherClasses,
    hideTeacher,
    teacherTotal,
    updateTeacher,
} from '../controllers/teacherControllers.js'
import { protect } from '../controllers/authController.js'
import { uploadBuffer } from '../configs/multer.js'
import { canCreateTeacher, canDeleteTeacher, canUpdateTeacher }
 from '../controllers/permissionsControlller.js'

const router = express.Router()

router.route('/').get(protect,getAllTeachers)
.post(protect, canCreateTeacher, uploadBuffer,createTeacher)
router.get('/total',protect,teacherTotal)
router.route('/deleteMany').post(protect, canDeleteTeacher, deleteManyTachers)
router.get('/hidden',protect,  getHiddenTeachers)
router.patch('/hide',protect,canDeleteTeacher, hideTeacher)
router.route('/classes/:id').get(protect,getTeacherClasses)
router
    .route('/:id')
    .get(getTeacherById)
    .patch(protect,uploadBuffer, canUpdateTeacher, updateTeacher)
    .delete(protect,uploadBuffer, canDeleteTeacher,deleteTeacher)



export default router
