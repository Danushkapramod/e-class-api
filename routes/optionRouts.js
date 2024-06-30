import express from 'express'
import {
    createOption,
    deleteOption,
    getOptions,
} from '../controllers/optionControllers.js'

const router = express.Router()

router.route('/').get(getOptions).post(createOption)
router.route('/:id').delete(deleteOption)

export default router
