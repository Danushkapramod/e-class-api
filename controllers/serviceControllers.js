/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import { google } from "googleapis";
import { Readable }from 'stream'
import { DriveTokens } from "../models/drive_tokens.js";
import AppErrror from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"
import { oauth2Client ,drive, setDriveCredentials} from "../configs/googleDrive.js";
import { getModelByTenant } from "../configs/database.js";
import { exportPdfBuffer } from "../utils/pdf/exportPDF.js";

const people = google.people({ version: 'v1', auth: oauth2Client });

async function findOrCreateFolder(folderName, parentId = null) {
    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false ${parentId ? `and '${parentId}' in parents` : ''}`;
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









const getAndSetDriveCredentials = async(userId)=>{
    const drive = await DriveTokens.findOne({userId}) 
    if(drive && drive.accessToken && drive.refreshToken){
       setDriveCredentials(drive.accessToken,drive.refreshToken)  
    }
}


 export const getBackupAccount = catchAsync(async function (req, res) {
    await getAndSetDriveCredentials(req.tenantId)  
    const resp = await people.people.get({
        resourceName: 'people/me',
        personFields: 'emailAddresses',
       });
    const email = resp.data.emailAddresses[0].value;     
    res.status(200).json(email)
})



export const driveOauthSignup = catchAsync(async function (req, res,next) {
    if(!req.body.code)return next()
    const postData = {
        code: req.body.code,
        client_id: '89181791749-i81vabbfv9pk58u2o25l5itu7jpke2j2.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:5173/app/backups',
        grant_type: 'authorization_code'
    }
    const response = await axios.post('https://oauth2.googleapis.com/token', postData);
    if(!response.data.access_token)return next(new AppErrror('?',400))
        await  DriveTokens.findOneAndUpdate({userId:req.tenantId},{
            userId:req.tenantId,
            accessToken:response.data.access_token,
            refreshToken:response.data.refresh_token
        },
        {upsert:true}
    )
    res.status(200).json(true)
})





export const backupClassPayments = catchAsync(async function (req, res) {
    const backupResults = [];
    const Class = getModelByTenant(req.tenantId, 'Class');
    const Student = getModelByTenant(req.tenantId, 'Student');
    const _class = await Class.find({isVisible: true}).populate('teacher').lean();
    
    if (_class.length) {
      getAndSetDriveCredentials(req.tenantId)  
      const edusultFolderId = await findOrCreateFolder('Edusult');
      const classFolderId = await findOrCreateFolder('class', edusultFolderId);
      const paymentSheetsFolderId = await findOrCreateFolder('paymentSheets', classFolderId);

      for (const classData of _class) {
        const fileName = `${classData.subject}-${classData.grade}-${classData.teacher.name}.pdf`;
        const _student = await Student.find({classId: classData._id}).lean();
        const buffer = await exportPdfBuffer({_student, user: req.user, _class: classData}, 'paymentsSheetFilled');
        const fileId = await uploadBufferToDrive(buffer, fileName, paymentSheetsFolderId);
        backupResults.push({ fileId });
      }
    } 
    res.status(200).json({ message: 'Backup completed', results: backupResults });
    
});


export const backupClasses = catchAsync(async function (req, res) {
    const backupResults = [];
    const Class = getModelByTenant(req.tenantId, 'Class');
    const _class = await Class.find({isVisible: true}).populate('teacher').lean();
    
    if (_class.length) {
      getAndSetDriveCredentials(req.tenantId)  
      const edusultFolderId = await findOrCreateFolder('Edusult');
      const classFolderId = await findOrCreateFolder('class', edusultFolderId);
      const classesFolderId = await findOrCreateFolder('classes', classFolderId);

      const fileName = `all_classes.pdf`;
      const buffer = await exportPdfBuffer({ user: req.user, _class}, 'class');
      const fileId = await uploadBufferToDrive(buffer, fileName, classesFolderId);
      backupResults.push({ fileId });
    
    } 
    res.status(200).json({ message: 'Backup completed', results: backupResults });
    
});

export const backupTeachers = catchAsync(async function (req, res) {
    const backupResults = [];
    const Teacher = getModelByTenant(req.tenantId, 'Teacher');
    const _teacher = await Teacher.find({isVisible: true}).lean()

    if (_teacher.length) {
      getAndSetDriveCredentials(req.tenantId)  
      const edusultFolderId = await findOrCreateFolder('Edusult');
      const teacherFolderId = await findOrCreateFolder('teacher', edusultFolderId);
      const teachersFolderId = await findOrCreateFolder('teachers', teacherFolderId);

      const fileName = `all_teachers.pdf`;
      const buffer = await exportPdfBuffer({ user: req.user,_teacher}, 'teacher');
      const fileId = await uploadBufferToDrive(buffer, fileName, teachersFolderId);
      backupResults.push({ fileId });
    
    } 
    res.status(200).json({ message: 'Backup completed', results: backupResults });
});


export const backupStudents = catchAsync(async function (req, res) {
    const backupResults = [];
    const Class = getModelByTenant(req.tenantId, 'Class');
    const Student = getModelByTenant(req.tenantId, 'Student');
    const _class = await Class.find({isVisible: true}).populate('teacher').lean();
    
    if (_class.length) {
      getAndSetDriveCredentials(req.tenantId)  
      const edusultFolderId = await findOrCreateFolder('Edusult');
      const studentFolderId = await findOrCreateFolder('student', edusultFolderId);
      const studentsFolderId = await findOrCreateFolder('students', studentFolderId);

      for (const classData of _class) {
        const fileName = `${classData.subject}-${classData.grade}-${classData.teacher.name}.pdf`;
        const _student = await Student.find({classId: classData._id}).lean();
        const buffer = await exportPdfBuffer({_student, user: req.user, _class: classData}, 'student');
        const fileId = await uploadBufferToDrive(buffer, fileName, studentsFolderId);
        backupResults.push({ fileId });
      }
    } 
    res.status(200).json({ message: 'Backup completed', results: backupResults });
    
});