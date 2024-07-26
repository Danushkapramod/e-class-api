import { v4 as uuidv4 } from 'uuid';
import { Student } from "../models/student.js";
import AppErrror from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { qrGenarateUpload } from "../utils/ImageHandle.js";

export const createStudent = catchAsync(async function(req,res,next){

async function sendQr({to,url}) {
 
    const res = await fetch('https://graph.facebook.com/v19.0/376649382200287/messages', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer EAAQMCLEWz1kBO0jrtInOGIq0Xnr9ld7TWKjEVMlRLMr2BwQUPxtbIZBZAXetxBuBH1eZCZBSy7oZAouZBtMC9CasTtrR0ExOZCMvTyaVXIv8mlkqMvjDBFvJIdgSRqcHYIf4XmWltHJFW1YKclyoqRETX8ewIUbah6bzqyK2gm9xuIoDzYZAfefDZBpdJVzjG9esVUIaPoifBwVr8P8Y9EXsZD',
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

    const {name,phone,sendQr:isRequestQr} = req.body;
    if(!(name || phone)) return next(new AppErrror('Please enter minimum one input',400))

    if(phone && await Student.findOne({phone:phone.trim()})){
       return next(new AppErrror('Phone number is already in use.', 401));
    }    
    const student = await Student.create(req.body);
    if(isRequestQr){
        const uuid = uuidv4()
        const qrData  = student.studentId.toString()
        const filename = `assets/images/sudent_qrs/${uuid}.png`
        const result =  await qrGenarateUpload(filename,'aws-bucket-e-class',qrData)
        
        if(result.$metadata.httpStatusCode === 200){
            const qrUrl = 'https://aws-bucket-e-class.s3.eu-north-1.amazonaws.com/'+filename
            console.log(qrUrl );
            setTimeout(()=> sendQr({to:req.body.phone,url:qrUrl}) ,2000)  
        }
     } 
    res.status(201).json({
        message:"success",
        body:{student}
    })  
})


export const getStudents = catchAsync(async function (req, res) {
    const students = await Student.find()
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