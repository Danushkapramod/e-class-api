
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { Class } from "../models/class.js"
import { ImageHandle } from "../utils/ImageHandle.js"
import catchAsync from "../utils/catchAsync.js"
import { exportCvs } from "../utils/cvs/exportCVS.js"
import { generateUniqueString } from "../utils/random.Genarates.js"
import { exportPdf } from '../utils/pdf/exportPDF.js';
import { ApiFeatures } from '../utils/ApiFeatures.js';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSignedAwsUrl = catchAsync(async function (req, res, next) {

    const imageHandle = new ImageHandle()
    const {path,bucket} = req.body
    const imageName = `${path}/${generateUniqueString(24)}.jpg`
    const URL = await imageHandle.upload(imageName,bucket)
    res.status(200).json({URL})
})

export const deleteFile = catchAsync(async function (req, res, next) {

    const imageHandle = new ImageHandle()
    const {fileName,bucket} = req.body
    await imageHandle.delete(fileName,bucket)
    res.status(200).json()
})


export const exportClassCvs = catchAsync(async function (req, res, next) {
    const data = await Class.find().select('-__v').lean(); 

    const filename = `assets/csv/classes.csv`;  // Generate a unique filename
    await exportCvs(data, filename);  // Ensure the CSV is written before sending the response
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});

export const exportClassPdf = catchAsync(async function (req, res, next) {
    const data = await Class.find().populate('teacher').exec()

    const filename = `assets/pdf/output.pdf`;
    await exportPdf(data, filename)
        res.download( filename, (err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json();
        })
});