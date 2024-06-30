import mongoose from 'mongoose'

const subjectModel = new mongoose.Schema({
    subjectName: { type: String, isLowercase: true, required: true },
})

export const Subject = mongoose.model('Subject', subjectModel)
