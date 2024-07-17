import express from 'express'
import {
    createOption,
    deleteOption,
    getOptions,
    optionTotal,
} from '../controllers/optionControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()
router.get('/total',protect,optionTotal)
router.route('/').get(protect,getOptions).post(protect,createOption)
router.route('/:id').delete(protect,deleteOption)

export default router
