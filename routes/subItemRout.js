import express from 'express'
import { protect } from '../controllers/authController.js'
import { createSubItem, deleteSubItem, getSubItems, subItemTotals } from '../controllers/subItemsController.js'
import { canDeleteSubitem } from '../controllers/permissionsControlller.js'

const router = express.Router()

router.route('/').get(protect,getSubItems).post(protect,createSubItem)
router.get('/total',protect,subItemTotals)
router.route('/:id').delete(protect, canDeleteSubitem, deleteSubItem)

export default router
