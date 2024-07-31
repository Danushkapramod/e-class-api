import fs from 'fs'
import { Student } from "../models/student.js";
import AppErrror from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { qrGenarateSave, qrGenarateUpload } from "../utils/ImageHandle.js";
import { ApiFeatures } from '../utils/ApiFeatures.js';
import { Email } from '../utils/Email.js';

export const createStudent = catchAsync(async function(req,res,next){

async function sendQrWhatsapp({to,url}) {
    const res = await fetch('https://graph.facebook.com/v19.0/376649382200287/messages', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAQMCLEWz1kBOxuOsIYZAPARssmZCY3811sFn5q8S9hTtZCroHfhMjymIaOtT9cfTGlusKwSkw98PD6bBXoy95aEssquXf9zZCnZCDpOlEnCkcv3ZCsViI2GnffTcIIOHZAxeKQb4eKLExa5R5Pb46lrTYwShPd4ZAiz6uZCUN1cvv2439EZC1SEuZB6XtiZAGsRXLVMmuD9wwi5jqrKntuWzFsZD',
    },
    body: JSON.stringify({
        messaging_product: "whatsapp",
        to: `94${to}`,
        type: "image",
        image: {
        link: url
        }
    })
    });    
}

async function sendQrGmail({email,name,file}) {
    new Email({email,name,file}).studentQR()

}
    const {name,phone,sendQr_gmail,sendQr_whatsapp} = req.body;
    if(!(name || phone)) return next(new AppErrror('Please enter minimum one input',400))

    if(phone && await Student.findOne({phone:phone.trim()})){
       return next(new AppErrror('Phone number is already in use.', 401));
    }    
    const student = await Student.create(req.body);

    if(sendQr_whatsapp || sendQrGmail){
        const qrData  = `${student._id.toString()} | ${student.studentId}`
        const qrLabel = student.studentId
        const filename = `assets/images/sudent_qrs/${student._id}.png`

      if(sendQrWhatsapp){
        const result =  await qrGenarateUpload(filename,'aws-bucket-e-class',qrData,qrLabel)
        if(result.$metadata.httpStatusCode === 200){
            const qrUrl = 'https://aws-bucket-e-class.s3.eu-north-1.amazonaws.com/'+filename
            console.log(qrUrl );
            setTimeout(()=>{  sendQrWhatsapp({to:req.body.phone,url:qrUrl}) },2000)  
        }
      }
       if(sendQr_gmail){
         const result =  await qrGenarateSave(filename,qrData,qrLabel)
         if(result){
            setTimeout(()=>{  sendQrGmail({email:req.body.gmail,name:req.body.name,file:filename})  },2000)  
            setTimeout(()=>{  fs.unlinkSync(filename); },60000)  
         }
     }
    } 
     
    res.status(201).json({
        message:"success",
        body:{student}
    })  
})

export const getStudents = catchAsync(async function (req, res) {
    const apiFeatures = new ApiFeatures(req,Student).filtering().searching().limiting()

    const students = await apiFeatures.query
    res.status(200).json({
        status: 'succes',
        body: { students },
    })
})

export const updateStudent = catchAsync(async function (req, res, next) {
    const studentById = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
    if (!studentById) {
        return next(new AppErrror('No Student found with that ID', 404))
    }
    res.status(200).json({
        status: 'succes',
        body: { studentById },
    })
})

export const deleteStudent = catchAsync(async function (req, res) {
    await Student.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'succes',
    })
})

export const deleteSelectedStudents = catchAsync(async function (req, res,next) {
    const {studentIds} = req.body
    if (!studentIds) {
        return next(new AppErrror('No Student found', 404))
    }
    await Student.deleteMany({_id:{$in:studentIds}})
    res.status(200).json({
        status: 'succes',
    })
})

export const updateSelectedStudents = catchAsync(async function (req, res,next) {
    const {studentIds,newData} = req.body

    if (!studentIds || !newData) {
        return next(new AppErrror('No Student found', 404))
    }
    await Student.updateMany({_id:{$in:studentIds}},  newData )
    res.status(200).json({
        status: 'succes',
    })
})


export const studentsTotal = catchAsync(async function (req, res) {
      const  total = await Student.countDocuments({}); 
      res.status(200).json({
        status: 'succes',
        body: { total },
    })
})
