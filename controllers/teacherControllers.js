import { getModelByTenant } from '../configs/database.js'
import { ApiFeatures } from '../utils/ApiFeatures.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

export const getAllTeachers = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const apiFeatures = new ApiFeatures(req,Teacher).filtering().pagination();

    const teachers = await apiFeatures.query;
    res.status(200).json({
        status: 'succes',
        body: { teachers },
    })
})

export const getTeacherById = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant (req.tenantId,'Teacher')
    const teacherById = await Teacher.find(req.params.id)

    if (!teacherById) {
        return next(new AppError('No Teacher found with that ID', 404))
    }
    res.status(200).json({
        status: 'succes',
        body: { teacherById },
    })
})

export const updateTeacher = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const teacherById = await Teacher.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    )
    if (!teacherById) {
        return next(new AppError('No teacher found with that ID', 404))
    }
    res.status(200).json({
        status: 'succes',
        body: { teacherById },
    })
})

export const deleteTeacher = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    await Teacher.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: 'succes',
    })
})

export const createTeacher = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')

    const newTeacher = await Teacher.create(req.body)
    res.status(201).json({
        status: 'succes',
        body: { newTeacher },
    })
})


export const teacherTotal = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
      const  total = await Teacher.countDocuments({}); 
      res.status(200).json({
        status: 'succes',
        body: { total },
    })
})
