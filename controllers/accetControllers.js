//import path from 'path';
//import { fileURLToPath } from 'url';

import { ImageHandle } from "../utils/ImageHandle.js"
import catchAsync from "../utils/catchAsync.js"
import { exportCvs } from "../utils/cvs/exportCVS.js"
import { generateUniqueString } from "../utils/random.Genarates.js"
import { exportPdf } from '../utils/pdf/exportPDF.js'
import { getModelByTenant } from "../configs/database.js"
import { Student } from "../models/student.js"
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
    const data = await Class.find().select('-__v').lean(); 

    const filename = `assets/csv/classes.csv`; 
    await exportCvs(data, filename,'class'); 
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});


export const exportClassPdf = catchAsync(async function (req, res, next) {
    const Class = getModelByTenant(req.tenantId,'Class')
    const data = await Class.find().populate('teacher').exec()

    const filename = `assets/pdf/output.pdf`;
    await exportPdf(data, filename,'class')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});

export const exportClassPaymentSheetPdf = catchAsync(async function (req, res, next) {
    const data = await Student.find()
    const filename = `assets/pdf/output.pdf`;
    await exportPdf(data, filename,'classPaymentSheet')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});

export const exportTeacherCvs = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const data = await Teacher.find().select('-__v').lean(); 
    
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
    const data = await Teacher.find()

    const filename = `assets/pdf/teachers.pdf`;
    await exportPdf(data, filename,'teacher')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});