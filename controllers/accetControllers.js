//import path from 'path';
//import { fileURLToPath } from 'url';

import { ImageHandle } from "../utils/ImageHandle.js"
import catchAsync from "../utils/catchAsync.js"
import { exportCvs } from "../utils/cvs/exportCVS.js"
import { generateUniqueString } from "../utils/random.Genarates.js"
import { exportPdf } from '../utils/pdf/exportPDF.js'
import { getModelByTenant } from "../configs/database.js"
import AppErrror from "../utils/AppError.js"

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

export const getSignedAwsUrl = catchAsync(async function (req, res ) {
    const imageHandle = new ImageHandle()
    const {path,bucket} = req.body
    const imageName = `${path}/${generateUniqueString(24)}.jpg`
    const URL = await imageHandle.upload(imageName,bucket)
    res.status(200).json({URL})
})

export const deleteFile = catchAsync(async function (req, res) {
    const imageHandle = new ImageHandle()
    const {fileName,bucket} = req.body
    await imageHandle.delete(fileName,bucket)
    res.status(200).json()
})

export const exportClassCvs = catchAsync(async function (req, res, next) {
    const Class = getModelByTenant(req.tenantId,'Class')

    const data = await  Class.find().lean(); 
    const filename = `assets/csv/classes.csv`; 
    await exportCvs({data,user:req.user}, filename,'class'); 
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});


export const exportClassPdf = catchAsync(async function (req, res, next) {
    const Class = getModelByTenant(req.tenantId,'Class')

    const data =  await Class.find().populate('teacher').lean().exec()
    const filename = `assets/pdf/output.pdf`;
    await exportPdf({data,user:req.user}, filename,'class')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
    });



export const exportClassPaymentSheetPdf = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('No class found with that ID', 404)) 

    const Student = getModelByTenant(req.tenantId,'Student')
    const Class = getModelByTenant(req.tenantId,'Class')
    const _class = await Class.findById(id).populate('teacher').lean()

    const query =  req.body._selected ? {_id:{$in:req.body._selected}}: {}
    const data = await Student.find({...query,classId:id}).lean()

    const filename = `assets/pdf/output.pdf`;
    await exportPdf({data,user:req.user,_class}, filename,'paymentsSheet')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});

export const exportStudentCvs = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('No class found with that ID', 404)) 
    const Student = getModelByTenant(req.tenantId,'Student')

    const query =  req.body._selected ? {_id:{$in:req.body._selected}}: {}
    const data = await Student.find({...query,classId:id}).lean() 
    const filename = `assets/csv/student.csv`;  
    await exportCvs(data, filename,'student'); 
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});


export const exportStudentPdf = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('No class found with that ID', 404)) 
    const Student = getModelByTenant(req.tenantId,'Student')

    const query =  req.body._selected ? {_id:{$in:req.body._selected}}: {}
    const data = await Student.find({...query,classId:id}).lean();  
    const filename = `assets/pdf/students.pdf`;
    await exportPdf({data}, filename,'student')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});





export const exportTeacherCvs = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')

    const data = await  Teacher.find().lean();  
    const filename = `assets/csv/teachers.csv`;  
    await exportCvs(data, filename,'teacher'); 
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});


export const exportTeacherPdf = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')

    const data = await Teacher.find().lean();  
    const filename = `assets/pdf/teachers.pdf`;
    await exportPdf({data}, filename,'teacher')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});