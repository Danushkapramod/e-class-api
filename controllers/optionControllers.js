import { getModelByTenant } from '../configs/database.js'
import catchAsync from '../utils/catchAsync.js'

export const deleteOption = catchAsync(async function (req, res) {
    if (req.query.option === 'subject') {
        const Subject = getModelByTenant(req.tenantId,'Subject')
        await Subject.findByIdAndDelete(req.params.id)

    } else if (req.query.option === 'hall') {
        const Hall = getModelByTenant(req.tenantId,'Hall')
        await Hall.findByIdAndDelete(req.params.id)

    } else if (req.query.option === 'grade') {
        const Grade = getModelByTenant(req.tenantId,'Grade')
        await Grade.findByIdAndDelete(req.params.id)
    }
    res.status(204).json({
        status: 'succes',
    })
})

export const getOptions = catchAsync(async function (req, res) {
    let options

    if (req.query.option === 'subject') {
        const Subject = getModelByTenant(req.tenantId,'Subject')
        options = await  Subject.find()
       
    } else if (req.query.option === 'hall') {
        const Hall = getModelByTenant(req.tenantId,'Hall')
        options = await  Hall.find()
  
    } else if (req.query.option === 'grade') {
        const Grade = getModelByTenant(req.tenantId,'Grade')
        options = await Grade.find()
    }
    res.status(200).json(options)
})

export const createOption = catchAsync(async function (req, res) {
    let option
    if (req.query.option === 'subject') {
        const Subject = getModelByTenant(req.tenantId,'Subject')
        option = await Subject.create(req.body)

    } else if (req.query.option === 'hall') {
        const Hall = getModelByTenant(req.tenantId,'Hall')
        option = await Hall.create(req.body)

    } else if (req.query.option === 'grade') {
        const Grade = getModelByTenant(req.tenantId,'Grade')
        option = await Grade.create(req.body)
    }
    res.status(201).json( option)
})


export const optionTotal = catchAsync(async function (req, res) {

    let total
    if (req.query.option === 'subject') {
        const Subject = getModelByTenant(req.tenantId,'Subject')
        total = await Subject.countDocuments(); 

    } else if (req.query.option === 'hall') {
        const Hall = getModelByTenant(req.tenantId,'Hall')
        total = await Hall.countDocuments(); 

    } else if (req.query.option === 'grade') {
        const Grade = getModelByTenant(req.tenantId,'Grade')
        total = await Grade.countDocuments(); 
    } else if (req.query.option === 'student') {
        const Student = getModelByTenant(req.tenantId,'Student')
        total = await Student.countDocuments(); 
    }
    res.status(201).json( total )
})

