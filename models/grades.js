import mongoose from 'mongoose'

export const gradeShema = new mongoose.Schema({
    gradeName: { type: String, isLowercase: true, required: true }
})

