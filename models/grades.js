import mongoose from 'mongoose'

const gradeModel = new mongoose.Schema({
    gradeName: { type: String, isLowercase: true, required: true },
})

export const Grade = mongoose.model('Grade', gradeModel)
