import express from 'express'
import {
    createClass,
    getAllClasses,
    getClassById,
} from '../controllers/classControllers.js'

const router = express.Router()

router.route('/').get(getAllClasses).post(createClass)

router.route('/:id').get(getClassById).patch().delete()

export default router
