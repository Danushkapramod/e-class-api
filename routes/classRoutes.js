import express from 'express'
import {
    createClass,
    deleteClass,
    getAllClasses,
    getClassById,
    updateClass,
} from '../controllers/classControllers.js'

const router = express.Router()

router.route('/').get(getAllClasses).post(createClass)

router.route('/:id').get(getClassById).patch(updateClass).delete(deleteClass)

export default router
