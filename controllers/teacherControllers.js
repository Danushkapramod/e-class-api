import { Teacher } from '../models/teacher.js'
import AppError from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'

export const getAllTeachers = catchAsync(async function (req, res, next) {
    const teachers = await Teacher.find()
     .populate({path:'classes',model:'Class'}) 
     .exec();
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

export const createTeacher = catchAsync(async function (req, res, next) {
    const data = Object.assign(req.body)
    const newTeacher = await Teacher.create(data)

    res.status(201).json({
        status: 'succes',
        body: { newTeacher },
    })
})
