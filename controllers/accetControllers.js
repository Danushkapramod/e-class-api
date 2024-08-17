/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
//import path from 'path';
//import { fileURLToPath } from 'url';

import { ImageHandle } from "../utils/ImageHandle.js"
import catchAsync from "../utils/catchAsync.js"
import { exportCvs } from "../utils/cvs/exportCVS.js"
import { generateUniqueString } from "../utils/random.Genarates.js"
import { exportPdf, exportPdfBuffer } from '../utils/pdf/exportPDF.js'
import { getModelByTenant } from "../configs/database.js"
import AppErrror from "../utils/AppError.js"
import { drive } from "../configs/googleDrive.js"
import { Readable }from 'stream'
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

export const exportClassPaymentsSheetFilledPdf = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('No class found with that ID', 404)) 

    const Student = getModelByTenant(req.tenantId,'Student')
    const Class = getModelByTenant(req.tenantId,'Class')
    const _class = await Class.findById(id).populate('teacher').lean()

    const query =  req.body._selected ? {_id:{$in:req.body._selected}}: {}
    const data = await Student.find({...query,classId:id}).lean()

    const filename = `assets/pdf/output.pdf`;
    await exportPdf({data,user:req.user,_class}, filename,'paymentsSheetFilled')
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});

export const exportClassPaymentsSheetFilledPdfBufferr = catchAsync(async function (req, res, next) {
    const {id} = req.params
    if(!id) return next(new AppErrror('No class found with that ID', 404)) 

    const Student = getModelByTenant(req.tenantId,'Student')
    const Class = getModelByTenant(req.tenantId,'Class')
    const _class = await Class.findById(id).populate('teacher').lean()

    const query =  req.body._selected ? {_id:{$in:req.body._selected}}: {}
    const data = await Student.find({...query,classId:id}).lean()

    const buffer =  await exportPdfBuffer({data,user:req.user,_class},'paymentsSheetFilled')
    
   
    
    const edusultFolderId = await findOrCreateFolder('Edusult');
    const classesFolderId = await findOrCreateFolder('classes', edusultFolderId);
    const paymentSheetsFolderId = await findOrCreateFolder('paymentSheets', classesFolderId);
  
    const fileId = await uploadBufferToDrive(buffer, `${_class.subject}-${_class.grade}-${_class.teacher.name}.pdf`)
    console.log(fileId );
    
    async function uploadBufferToDrive(buffer, fileName) {
        const fileMetadata = {
          name: fileName,
          parents: [paymentSheetsFolderId]
        };
        const media = {
          mimeType: 'application/pdf',
          body: Readable.from(buffer)
        };
        
        const file = await drive.files.create({
          resource: fileMetadata,
          media,
          fields: 'id',
        });
        
        return file.data.id;
      }
    res.status(200).json();
});

 async function findOrCreateFolder(folderName, parentId = null) {
    const query = `mimeType='application/vnd.google-apps.folder' and name='
    ${folderName}' and trashed=false ${parentId ? `and '${parentId}' in parents` : ''}`;
    const res = await drive.files.list({ q: query, fields: 'files(id, name)' });
    
    if (res.data.files.length > 0) {
        return res.data.files[0].id;
    } 
    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: parentId ? [parentId] : []
    };
    const folder = await drive.files.create({
      resource: folderMetadata,
      fields: 'id'
    });
    return folder.data.id;
    
    }

    async function findFile(fileName, folderId) {
        const query = `name='${fileName}' and '${folderId}' in parents and trashed=false`;
        const res = await drive.files.list({ q: query, fields: 'files(id, name)' });
        return res.data.files[0] || null;
      }

    async function uploadBufferToDrive(buffer, fileName, folderId) {
    const existingFile = await findFile(fileName, folderId);    
    if (existingFile) {
        await drive.files.update({
          fileId: existingFile.id,
          uploadType: 'media',
          media: {
            mimeType: 'application/pdf',
            body: Readable.from(buffer)
          }

        });
        return existingFile.id;

      } 
    const fileMetadata = {
        name: fileName,
        parents: [folderId]
    };
    const media = {
        mimeType: 'application/pdf',
        body: Readable.from(buffer)
    };
    
    const file = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id'
    });
    
    return file.data.id;
    
 }

export const exportClassPaymentsSheetFilledPdfBuffer = catchAsync(async function (req, res, next) {
    
    const Class = getModelByTenant(req.tenantId, 'Class');
    const Student = getModelByTenant(req.tenantId, 'Student');
    const _class = await Class.find({isVisible: true}).populate('teacher').lean();
    const backupResults = [];

    if (_class.length) {
      const edusultFolderId = await findOrCreateFolder('Edusult');
      const classesFolderId = await findOrCreateFolder('classes', edusultFolderId);
      const paymentSheetsFolderId = await findOrCreateFolder('paymentSheets', classesFolderId);

      for (const classData of _class) {
        const fileName = `${classData.subject}-${classData.grade}-${classData.teacher.name}.pdf`;
        const data = await Student.find({classId: classData._id}).lean();
        const buffer = await exportPdfBuffer({data, user: req.user, _class: classData}, 'paymentsSheetFilled');
        const fileId = await uploadBufferToDrive(buffer, fileName, paymentSheetsFolderId);
        backupResults.push({ fileId });
      }
    }
    
    
    res.status(200).json({ message: 'Backup completed', results: backupResults });
    
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