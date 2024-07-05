import { ImageHandle } from "../utils/ImageHandle.js"
import catchAsync from "../utils/catchAsync.js"
import { generateUniqueString } from "../utils/random.Genarates.js"



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
