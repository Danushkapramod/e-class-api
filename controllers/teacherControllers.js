import { Teacher } from '../models/teacher.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

export const getAllTeachers = catchAsync(async function (req, res, next) {
    const teachers = await Teacher.find()
    res.status(200).json({
        status: 'succes',
        body: { teachers },
    })
})

export const getTeacherById = catchAsync(async function (req, res, next) {
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

export const deleteTeacher = catchAsync(async function (req, res, next) {
    await Teacher.findByIdAndDelete(req.params.id)

    res.status(200).json({
        status: 'succes',
    })
})

export const createTeacher = catchAsync(async function (req, res, next) {
    const data = Object.assign(req.body)
    const newTeacher = await Teacher.create(data)

    res.status(201).json({
        status: 'succes',
        body: { newTeacher },
    })
})
