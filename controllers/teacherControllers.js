import { S3BASE_URL } from '../configs/aws-config.js'
import { getModelByTenant } from '../configs/database.js'
import { ApiFeatures } from '../utils/ApiFeatures.js'
import AppErrror from '../utils/AppError.js'
import catchAsync from '../utils/catchAsync.js'
import { resizeImage, s3deleteFile, updateBuffer, uploadBuffer } from '../utils/ImageHandle.js'

export const getAllTeachers = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const apiFeatures = new ApiFeatures(req,Teacher.find({isVisible:true})).searching().filtering().pagination();

    const teachers = await apiFeatures.query;
    res.status(200).json( teachers )
})
export const getTeacherClasses = catchAsync(async function (req, res, next) {
    const { id } = req.params;
    if (!id) return next(new AppErrror('Missing required fields'), 404)

    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const Class = getModelByTenant(req.tenantId,'Class')

    const teacher= await Teacher.find({isVisible:true})
    if(!teacher) return next(new AppErrror('Teacher not found', 404));
    
    const classes = await Class.find({ teacher: id, isVisible: true });
    res.status(200).json( classes)
})

export const getHiddenTeachers = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const teachers = await Teacher.find({isVisible:false})
    res.status(200).json(teachers)
})
export const getTeacherById = catchAsync(async function (req, res, next) {
    const Teacher = getModelByTenant (req.tenantId,'Teacher')
    const teacherById = await Teacher.find(req.params.id)

    if (!teacherById) {
        return next(new AppErrror('No Teacher found with that ID', 404))
    }
    res.status(200).json( teacherById )
})

export const updateTeacher = catchAsync(async function (req, res, next) {
    if(req.file && req.file.buffer){
        const resizeBuffer = await resizeImage({buffer:req.file.buffer,width:256,height:256})
        const fileName = `assets/images/teacher-avatars/teacher-${req.tenantId}-${Date.now()}.webp`
        const result = await updateBuffer({fileUrl:req.body.oldAvatar,fileName,buffer:resizeBuffer})

        if(result){
            const avatar = `${S3BASE_URL}${fileName}`;
            req.body = {...req.body,avatar}
        }
    }
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
        return next(new AppErrror('No teacher found with that ID', 404))
    }
    res.status(200).json( teacherById )
})


export const hideTeacher = catchAsync(async function (req, res, next) {
    const {data,idList} = req.body
    if(!data || !idList) return next()
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    await Teacher.updateMany({_id:{$in:idList}},data)
    res.status(200).json()
})

export const deleteTeacher = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const teacher = await Teacher.findByIdAndDelete(req.params.id)
    
    if(teacher.avatar){
        const oldFileName = teacher.avatar.split("amazonaws.com/")[1] 
        s3deleteFile({fileName:oldFileName})
    }
    res.status(200).json({
        status: 'succes',
    })
})

export const deleteManyTachers = catchAsync(async function (req, res,next) {
    const {idList} = req.body
    if (!idList) {
        return next(new AppErrror('No Student found', 404))
     }
    const Teacher = getModelByTenant(req.tenantId,'Teacher')

    const teachersToDelete = await Teacher.find({_id:{$in:idList}});
    const deleteResult = await Teacher.deleteMany({_id:{$in:idList}})

    if (deleteResult.deletedCount === 0) {
        return next(new AppErrror('No Teachers were deleted', 404));
    }
    await Promise.all(teachersToDelete.map(async (teacher) => {
        if (teacher.avatar) {
            const oldFileName = teacher.avatar.split('amazonaws.com/')[1];
            await s3deleteFile({ fileName: oldFileName });
        }
    }));
    res.status(200).json({
        status: 'succes',
    })
})

export const createTeacher = catchAsync(async function (req, res) {
    if(req.file && req.file.buffer){
        const resizedBuffer = await resizeImage({buffer:req.file.buffer,height:256,width:256})
        const fileName = `assets/images/teacher-avatars/teacher-${req.tenantId}-${Date.now()}.webp`
        const result =  await uploadBuffer({fileName,buffer:resizedBuffer})
        
         if(result){
           const avatar = `${S3BASE_URL}${fileName}`
           req.body = {...req.body,avatar}
          }
      }
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
    const newTeacher = await Teacher.create(req.body)

    res.status(201).json( newTeacher)
})


export const teacherTotal = catchAsync(async function (req, res) {
    const Teacher = getModelByTenant(req.tenantId,'Teacher')
      const  total = await Teacher.countDocuments({}); 
      res.status(200).json( total)
})
