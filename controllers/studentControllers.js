import fs from 'fs'
import  pkg  from 'whatsapp-web.js';
import AppErrror from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { qrGenarateSave, qrGenarateUpload } from "../utils/ImageHandle.js";
import { ApiFeatures } from '../utils/ApiFeatures.js';
import { Email } from '../utils/Email.js';
import { getModelByTenant } from '../configs/database.js';
import { S3BASE_URL } from '../configs/aws-config.js';
import { client } from '../configs/whatsapp-web-config.js';

const { MessageMedia } = pkg;
async function sendQrWhatsapp({to,url}) {
//     const res = await fetch('https://graph.facebook.com/v19.0/376649382200287/messages', {
//     method: "POST",
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer EAAQMCLEWz1kBO5ya1G7MMLfeu7ikWh73BZASyqPbtiYZAJWBclIahZCWWX4ZAsGBivgndaFJW7GqNBjgQzpe6gVd1oAH5ZAPH7PaU2G0hP0DMDvm2bx27Y9eMdcrn77sHBrYMZCanR5K9lHIwcROaecU1wL8ScxhZBgzOJQbtqlIEAvN2BChWhrfef5GlTWlmGAZAhEAlZB7qiBZA8ZA8yCWD8ZD',
//     },
//     body: JSON.stringify({
//         messaging_product: "whatsapp",
//         to: `94${to}`,
//         type: "image",
//         image: {
//         link: url
//         }
//     })
// });  
const number = to[0] === '0' ? to.slice(1) : to;
console.log(number);
const media = await MessageMedia.fromUrl(url, { unsafeMime: true } );
client.sendMessage(`94${number}@c.us`, media, { caption: "Your Edusuit QR" });
}



async function sendQrGmail({email,name,file}) {
    new Email({email:email.trim(),name,file}).studentQR()

}


async function sendQr(data){
    const {gmail ,phone,sendQr_gmail,sendQr_whatsapp, student, name } = data;

    if(sendQr_whatsapp || sendQr_gmail){
        const qrData  = `${student._id.toString()} | ${student.studentId}`
        const qrLabel = student.studentId
        const filename = `assets/images/sudent_qrs/${student._id}.png`

      if(sendQr_whatsapp){
        const result =  await qrGenarateUpload(filename,'aws-bucket-e-class',qrData,qrLabel)
        if(result.$metadata.httpStatusCode === 200){
            const qrUrl = S3BASE_URL+filename
            console.log(qrUrl );
            setTimeout(()=>{ sendQrWhatsapp({to: phone.trim(),url:qrUrl})},2000)  
        }
      }
       if(sendQr_gmail){
         const result =  await qrGenarateSave(filename,qrData,qrLabel)
         if(result){
            setTimeout(()=>{ sendQrGmail({email: gmail, name, file:filename})},2000)  
            setTimeout(()=>{ fs.unlinkSync(filename); },60000)  
        }
     }
    } 
}


export const createStudent = catchAsync(async function(req,res,next){
    const {name,phone,sendQr_gmail,sendQr_whatsapp, gmail} = req.body;

    if(!(name || phone)) return next(new AppErrror('Please enter minimum one input',400))
    const Student = getModelByTenant(req.tenantId,'Student')

    if(phone && await Student.findOne({phone:phone.trim()})){
       return next(new AppErrror('Phone number is already in use.', 401));
    }
     const Counter = getModelByTenant(req.tenantId,'Counter');
     if (!await Counter.findOne({ for: "Student" })) {
      await Counter.create({ for: "Student", sequenceValue: 1000 });
     }
     const counter = await Counter.findOneAndUpdate({for:"Student"},
     { $inc: { sequenceValue: 1 } },{ new: true })

    const student = await Student.create({...req.body,studentId:counter.sequenceValue});
    
    const qrData = {gmail ,phone,sendQr_gmail,sendQr_whatsapp, student, name }
    await sendQr(qrData)
    res.status(201).json(student)  
})


export const resendQr = catchAsync(async function (req, res,next) {
    const {id} = req.params;
    if(!id) return next(new AppErrror('Not Provided studentId', 404));
    const { sendQr_gmail, sendQr_whatsapp, gmail} = req.body;  

    const Student = getModelByTenant(req.tenantId,'Student');
    const student =  await Student.findById(id);
    if(!student) return next(new AppErrror('No student found with that ID', 404));

    const qrData = {gmail ,phone: student.phone, sendQr_gmail,sendQr_whatsapp, 
        student, name: student.name }
    await sendQr(qrData);
    res.status(200).json('success')
})


export const getStudents = catchAsync(async function (req, res,next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('Not Provided classId', 404))
        
    const Student = getModelByTenant(req.tenantId,'Student')

    const isFiltering = Boolean(req.query.status)

    let query = !isFiltering ? {'class.classId': id }: 
    {class: { $elemMatch: { classId: id, status: req.query.status } }}
    query ={...query, isVisible: true}
    const apiFeatures = new ApiFeatures(req,Student.find(query)).searching().pagination()

    const students = await apiFeatures.query
    res.status(200).json( students)
})

export const getOneStudent = catchAsync(async function (req, res,next) {
    const {studentId} = req.params
    if(!studentId) return next(new AppErrror('No student found with that ID', 404));
        
    const Student = getModelByTenant(req.tenantId,'Student');
    const student = await Student.findById(studentId);

    res.status(200).json(student)
})


export const getAllStudents = catchAsync(async function (req, res ) {
    const Student = getModelByTenant(req.tenantId,'Student')
    const apiFeatures = new ApiFeatures(req,Student.find({isVisible:true})).searching().pagination()

    const students = await apiFeatures.query
    res.status(200).json( students)
})

export const updateStudent = catchAsync(async function (req, res, next) {
    const Student = getModelByTenant(req.tenantId,'Student')
    const studentById = await Student.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    )
    if (!studentById) {
        return next(new AppErrror('No Student found with that ID', 404))
    }
    res.status(200).json( studentById)
})

export const deleteStudent = catchAsync(async function (req, res) {
    const Student = getModelByTenant(req.tenantId,'Student')
    await Student.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'succes',
    })
})

export const deleteManyStudents = catchAsync(async function (req, res,next) {
    const {idList} = req.body
    if (!idList) {
        return next(new AppErrror('No Student found', 404))
    }
    const Student = getModelByTenant(req.tenantId,'Student')
    await Student.deleteMany({_id:{$in:idList}})
    res.status(200).json({
        status: 'succes',
    })
})


export const updateSelectedStudents = catchAsync(async function (req, res,next) {
    const {studentIds,newData} = req.body

    if (!studentIds || !newData) {
        return next(new AppErrror('No Student found', 404))
    }
    const Student = getModelByTenant(req.tenantId,'Student')
    await Student.updateMany({_id:{$in:studentIds}},  newData )
    res.status(200).json({
        status: 'succes',
    })
})

export const addClassForSelectedStudents= catchAsync(async function (req, res,next) {
    const {studentIds,newData} = req.body

    if (!studentIds || !newData) {
        return next(new AppErrror('No Student found', 404))
    }
    const Student = getModelByTenant(req.tenantId,'Student')
    await Student.updateMany({_id:{$in:studentIds}}, { $addToSet: { class: { $each: newData } } } )
    res.status(200).json('succes')
})

export const studentsTotal = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next( AppErrror('Class ID is required', 400))
    const Student = getModelByTenant(req.tenantId,'Student')
    const total  = await Student.countDocuments({'class.classId':id, isVisible:true}); 
      res.status(200).json(total)
})

export const studentsTotalAll = catchAsync(async function (req, res) {
    const Student = getModelByTenant(req.tenantId,'Student')
     const total  = await Student.countDocuments({isVisible:true}); 
      res.status(200).json(total)
})

export const getHiddenStudents = catchAsync(async function (req, res) {
    const Student = getModelByTenant(req.tenantId,'Student')
    const students = await Student.find({isVisible:false})
    res.status(200).json(students)
})

export const hideStudent = catchAsync(async function (req, res, next) {
    const {data,idList} = req.body;
    if(!data || !idList) return next();
    const Student = getModelByTenant(req.tenantId,'Student');
    await Student.updateMany({_id:{$in:idList}},data);
    res.status(200).json();
})

export const updateStatus = catchAsync(async function (req, res, next) {
    const { studentIds, classId, newData } = req.body
    if (!studentIds || !classId || !newData){ 
        return next(new AppErrror('Missing required fields', 404));
    }
    const Student = getModelByTenant(req.tenantId, 'Student');
    await Student.updateMany(
        { _id: { $in: studentIds }, 'class.classId': classId },
        { $set: { 'class.$.status': newData.status } }
    )
    res.status(200).json('success');
})

export const getStudentInfoForUpdate = catchAsync(async function (req, res, next) {
    const { id } = req.params;
    if (!id) return next(new AppErrror('Missing required fields', 404));

    const Student = getModelByTenant(req.tenantId, 'Student');
    const Class = getModelByTenant(req.tenantId, 'Class');

    const student = await Student.findOne({_id: id, isVisible: true}).lean();
    if (!student) return next(new AppErrror('Student not found', 404));

    const classIds = student.class?.map(({classId}) => classId) || []
    const classes = classIds.length
    ? await Class.find({ _id: { $in: classIds }, isVisible: true }).populate('teacher').lean()
    : [];
    
    res.status(200).json({...student, class: classes});
})