import { getModelByTenant } from "../configs/database.js";
import catchAsync from "../utils/catchAsync.js";


export const getSubItems = catchAsync(async function (req, res,next) {
    if(!req.query.category) return next()
    const SubItems = getModelByTenant(req.tenantId,'Sub_items')
    const items = await  SubItems.find({category:req.query.category})
    res.status(200).json(items);  
})

export const deleteSubItem = catchAsync(async function (req, res, next) {
    if(!req.params.id) return next()
    const SubItems = getModelByTenant(req.tenantId,'Sub_items')
    await  SubItems.findByIdAndDelete(req.params.id)
    res.status(200).json();  
})

export const createSubItem = catchAsync(async function (req, res, next) {
    if(!req.body) return next()
    const SubItems = getModelByTenant(req.tenantId,'Sub_items')
    const items = await  SubItems.create(req.body)
    res.status(200).json(items);  
})

export const subItemTotals = catchAsync(async function (req, res, next) {
    if(!req.body) return next()
    const SubItems = getModelByTenant(req.tenantId,'Sub_items')
    const subjects = await  SubItems.countDocuments({category:'subject'})
    const halls = await  SubItems.countDocuments({category:'hall'})
    const grades = await  SubItems.countDocuments({category:'grade'})
    res.status(200).json({subjects,halls,grades});  
})