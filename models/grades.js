import mongoose from 'mongoose'

export const gradeShema = new mongoose.Schema({
    gradeName: { type: String, isLowercase: true, required: true },
    isVisible:{type:Boolean,default:true},
})

