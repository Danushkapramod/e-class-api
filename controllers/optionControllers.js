import { Grade } from '../models/grades.js'
import { Hall } from '../models/halls.js'
import { Subject } from '../models/subjects.js'
import catchAsync from '../utils/catchAsync.js'

export const deleteOption = catchAsync(async function (req, res, next) {
    if (req.query.option === 'subject') {
        await Subject.findByIdAndDelete(req.params.id)
    } else if (req.query.option === 'hall') {
        await Hall.findByIdAndDelete(req.params.id)
    } else if (req.query.option === 'grade') {
        await Grade.findByIdAndDelete(req.params.id)
    }
    res.status(204).json({
        status: 'succes',
    })
})

export const getOptions = catchAsync(async function (req, res, next) {
    let options

    if (req.query.option === 'subject') {
        options = await Subject.find({tenant_id:req.user.tenant_id})
    } else if (req.query.option === 'hall') {
        options = await Hall.find({tenant_id:req.user.tenant_id})
    } else if (req.query.option === 'grade') {
        options = await Grade.find({tenant_id:req.user.tenant_id})
    }

    res.status(200).json({
        status: 'succes',
        body: { options },
    })
})

export const createOption = catchAsync(async function (req, res, next) {
    let option

    if (req.query.option === 'subject') {
        option = await Subject.create({...req.body,tenant_id:req.user.tenant_id})
    } else if (req.query.option === 'hall') {
        option = await Hall.create({...req.body,tenant_id:req.user.tenant_id})
    } else if (req.query.option === 'grade') {
        option = await Grade.create({...req.body,tenant_id:req.user.tenant_id})
    }

    res.status(201).json({
        status: 'success',
        body: { option },
    })
})


export const optionTotal = catchAsync(async function (req, res, next) {

    let total
    if (req.query.option === 'subject') {
        total = await Subject.countDocuments({}); 
    } else if (req.query.option === 'hall') {
        total = await Hall.countDocuments({}); 
    } else if (req.query.option === 'grade') {
        total = await Grade.countDocuments({}); 
    }
    res.status(201).json({
        status: 'success',
        body: { total },
    })
})

