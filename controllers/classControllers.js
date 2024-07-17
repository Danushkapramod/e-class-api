import { Class, classSchema } from '../models/class.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { ApiFeatures } from '../utils/ApiFeatures.js'

export const getAllClasses = catchAsync(async function (req, res, next) {
    const apiFeatures = new ApiFeatures(req, Class)
        .filtering()
        .sorting()
        .limiting()
        .pagination()
        .withTeacher()

    const classes = await apiFeatures.query
    res.status(200).json({
        status: 'succes',
        body: { classes },
    })
})

export const classesTotal = catchAsync(async function (req, res, next) {
     const total = await Class.countDocuments({}); 
      res.status(200).json({
        status: 'succes',
        body: { total },
    })
})


export const filterTenant = catchAsync( async function (req, res,next) {
    const {tenant_id} = req.user
    req.user.find({tenant_id})
    next()
})

export const getClassById = catchAsync(async function (req, res, next) {

    const classById = await Class.findById(req.params.id)
    if (!classById) {
        return next(new AppError('No claas found with that ID', 404))
    }
    res.status(200).json({
        status: 'succes',
        body: { classById },
    })
})

export const updateClass = catchAsync(async function (req, res, next) {
    const classById = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!classById) {
        return next(new AppError('No claas found with that ID', 404))
    }

    res.status(200).json({
        status: 'succes',
        body: { classById },
    })
})

export const deleteClass = catchAsync(async function (req, res, next) {
    await Class.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'succes',
    })
})

export const createClass = catchAsync(async function (req, res, next) {
    const newclass = await Class.create({...req.body,tenant_id:req.user.tenant_id})
    res.status(201).json({
        status: 'succes',
        body: { newclass },
    })
})
