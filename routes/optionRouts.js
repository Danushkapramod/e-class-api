import express from 'express'
import {
    createOption,
    deleteOption,
    getOptions,
    optionTotal,
} from '../controllers/optionControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()
router.get('/total',optionTotal)
router.route('/').get(getOptions).post(protect,createOption)
router.route('/:id').delete(protect,deleteOption)

export default router
