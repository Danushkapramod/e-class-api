
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { ApiFeatures } from '../utils/ApiFeatures.js'
import { getModelByTenant } from '../configs/database.js'
import { resizeImage, s3deleteFile, updateBuffer, uploadBuffer } from '../utils/ImageHandle.js'
import { S3BASE_URL } from '../configs/aws-config.js'

export const getAllClasses = catchAsync(async function (req, res) {
    const Class = getModelByTenant(req.tenantId,"Class")
    const apiFeatures = new ApiFeatures(req, Class.find({isVisible:true}))
        .searching()
        .filtering()
        .sorting()
        .limiting()
        .pagination()
        .withTeacher()
        

    const classes = await apiFeatures.query
    res.status(200).json(classes)
})

export const classesTotal = catchAsync(async function (req, res) {
    const Class = getModelByTenant(req.tenantId,"Class")
     const total = await Class.countDocuments(); 
      res.status(200).json(total)
})


export const getClassById = catchAsync(async function (req, res, next) {
    const Class = getModelByTenant(req.tenantId,"Class")
    const classById = await Class.findById(req.params.id)
    if (!classById) {
        return next(new AppError('No claas found with that ID', 404))
    }
    res.status(200).json( classById)
})

export const updateClass = catchAsync(async function (req, res, next) {
    if(req.file && req.file.buffer){
      const resizedBuffer = await resizeImage({buffer:req.file.buffer,height:256,width:256})
      const fileName = `assets/images/class-avatars/class-${req.user._id}-${Date.now()}.webp`
      const result =  await updateBuffer({fileUrl:req.body.oldAvatar,fileName,buffer:resizedBuffer})
  
      if(result){
         const avatar = `${S3BASE_URL}${fileName}`
         req.body = {...req.body,avatar}
        }
    }
    const Class = getModelByTenant(req.tenantId,"Class")
    const classById = await Class.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators: true,
    })
    if (!classById) {
        return next(new AppError('No claas found with that ID', 404))
    }
    res.status(200).json( classById)
})

export const deleteClass = catchAsync(async function (req, res) {
    const Class = getModelByTenant(req.tenantId,"Class")
    const _class = await Class.findByIdAndDelete(req.params.id)

    if(_class.avatar){
      const oldFileName = _class.avatar.split("amazonaws.com/")[1] 
      s3deleteFile({fileName:oldFileName})
    }
    res.status(200).json({
        status: 'succes',
    })
})

export const deleteManyClasses = catchAsync(async function (req, res,next) {
    const {idList} = req.body
    if (!idList) {
        return next(new AppError('No Classes found', 404))
     }
    const Class = getModelByTenant(req.tenantId,'Class')
    
    const classesToDelete = await Class.find({_id:{$in:idList}});
    const deleteResult = await Class.deleteMany({_id:{$in:idList}})

    if (deleteResult.deletedCount === 0) {
        return next(new AppError('No Classes were deleted', 404));
    }
    await Promise.all(classesToDelete.map(async (_class) => {
        if (_class.avatar) {
            const oldFileName = _class.avatar.split('amazonaws.com/')[1];
            await s3deleteFile({ fileName: oldFileName });
        }
    }));
    res.status(200).json({
        status: 'succes',
    })
})
export const createClass = catchAsync(async function (req, res) {
    if(req.file && req.file.buffer){
        const resizedBuffer = await resizeImage({buffer:req.file.buffer,height:256,width:256})
        const fileName = `assets/images/class-avatars/class-${req.user._id}-${Date.now()}.webp`
        const result =  await uploadBuffer({fileName,buffer:resizedBuffer})
        
         if(result){
           const avatar = `${S3BASE_URL}${fileName}`
           req.body = {...req.body,avatar}
          }
      }
    const Class = getModelByTenant(req.tenantId,"Class")
    const newclass = await Class.create({...req.body,tenant_id:req.user.tenant_id})
    res.status(201).json(newclass)
})

export const hideClass = catchAsync(async function (req, res, next) {
    const {data,idList} = req.body
    if(!data || !idList) return next()
    const Class = getModelByTenant(req.tenantId,'Class')
    await Class.updateMany({_id:{$in:idList}},data)
    res.status(200).json()
})

export const getHiddenClasses = catchAsync(async function (req, res) {
    const Class = getModelByTenant(req.tenantId,'Class')
    const classes = await Class.find({isVisible:false})
    res.status(200).json(classes)
})







export const getAttendances = catchAsync(async function (req, res,next) {
    const {id:classId } = req.params
    if(!classId) return next()
    const Attendance = getModelByTenant(req.tenantId,'Attendance')
    const attendances = await Attendance.find({classId})
    res.status(200).json(attendances)
})