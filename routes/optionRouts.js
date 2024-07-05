import express from 'express'
import {
    createOption,
    deleteOption,
    getOptions,
} from '../controllers/optionControllers.js'
import { protect } from '../controllers/authController.js'

const router = express.Router()

router.route('/').get(getOptions).post(protect,createOption)
router.route('/:id').delete(protect,deleteOption)

export default router
