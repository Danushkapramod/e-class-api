
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


export const createAttendance = catchAsync(async function (req, res,next) {
    if(!req.body) return next()     
    const Attendance = getModelByTenant(req.tenantId,'Attendance')
    const attendance = await Attendance.create(req.body)
    res.status(201).json(attendance)
})


function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istOffset = 5.5 * 60 * 60000;
    const istTime = new Date(utc + istOffset);
    
    const dayNumber = istTime.getDay();
    return days[dayNumber];
}


export const confirmAttendance = catchAsync(async function (req, res, next) {
    const { classId, studentId } = req.query;

    if (!classId || !studentId) {
        return next(new AppError('Missing classId or studentId', 400));
    }
    const Student = getModelByTenant(req.tenantId, 'Student');
    const Attendance = getModelByTenant(req.tenantId, 'Attendance');
    const Class = getModelByTenant(req.tenantId, 'Class'); 

    const student = await Student.findById(studentId);
    if (!student) {
        return next(new AppError('Invalid QR or student ID', 400));
    }

    const _class = await Class.findOne({ _id: classId});
    if (!_class) {
        return next(new AppError('No matching class found', 400));
    }

    const studentClass = student.class.find((classItem)=>classItem.classId === classId)       
    if (!studentClass) {
        return next(new AppError('No matching class found for this student', 400));
    }
    const isToday = _class.day === getCurrentDay();
    if(!isToday) return next(new AppError('Class day does not match today\'s date', 400));

    const today = new Date();
    const todayDate = today.toISOString().slice(0, 10); // Format: 'YYYY-MM-DD'
    const alreadyMarked = await Attendance.exists({
        classId, studentId, date: { $gte: new Date(todayDate + 'T00:00:00Z')}
    });
    if (alreadyMarked) {
        return next(new AppError('Attendance already marked for today', 400));
    }
    await Attendance.create({ classId, studentId, isPresent: true });

    res.status(201).json(true);
});



export const confirmPayment = catchAsync(async function (req, res, next) {
    const { classId, studentId } = req.query;

    if (!classId || !studentId) {
        return next(new AppError('Missing classId or studentId', 400));
    }
    const Student = getModelByTenant(req.tenantId, 'Student');
    const Class = getModelByTenant(req.tenantId, 'Class'); 

    const student = await Student.findById(studentId);
    if (!student) {
        return next(new AppError('Invalid QR or student ID', 400));
    }
    const _class = await Class.findOne({ _id: classId});
    if (!_class) {
        return next(new AppError('No matching class found', 400));
    }
    const studentClass = student.class.find((classItem)=>classItem.classId)       
    if (!studentClass) {
        return next(new AppError('No matching class found for this student', 400));
    }
    const isToday = _class.day === getCurrentDay();
    if(!isToday) return next(new AppError('Class day does not match today\'s date', 400));

    student.class = student.class.map((classData)=>{
        if(classData.classId === classId){
            if(classData.status === 'paid'){
                return next(new AppError('Payment already marked for this montht', 400));
            }
         return {classId, status:'paid'}
        }return classData  
    })
    await student.save()

    res.status(201).json(true);
});