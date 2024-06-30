import { Class } from '../models/class.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

export const getAllClasses = catchAsync(async function (req, res, next) {

 //1)filtring
 const queryObj = { ...req.query };
 const excludField = ['page', 'sort', 'limit', 'fields',"teacher"];
 excludField.forEach((el) => {
   delete queryObj[el];
 });
 //advanced filtring
 let queryStr = JSON.stringify(queryObj);
 queryStr = queryStr.replace(/(gt|gte|lte|lt)/g, (matched) => `$${matched}`)
 let query =  Class.find(JSON.parse(queryStr));

 //2) sorting

 if (req.query.sort) {
   const sortBy = req.query.sort.split(',').join(' ');
   query = Class.find(JSON.parse(queryStr)).sort(sortBy);
 }
 //3)Field limiting
 if (req.query.fields) {
   const fields = req.query.fields.split(',').join(' ');
   query =  Class.find(JSON.parse(queryStr)).select(fields);
 }
 //Pagination page and limit
 if (req.query.page) {
   const page = req.query.page * 1 || 1;
   const limit = req.query.limit * 1 || 100;
   const skip = (page - 1) * limit;
   const numItems = await Class.countDocuments();
   if (skip >= numItems) {
     throw new Error('this page do not exist');
   }
   query =  Class.find(JSON.parse(queryStr)).skip(skip).limit(limit);
 }
 //with teacher
 if (req.query.teacher === "true") {
    query =  query.populate('teacher').exec()
 }   
 //execute query
    const classes = await query
    res.status(200).json({
        status: 'succes',
        body: { classes },
    })
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
    const data = Object.assign(req.body)
    const newclass = await Class.create(data)

    res.status(201).json({
        status: 'succes',
        body: { newclass },
    })
})
