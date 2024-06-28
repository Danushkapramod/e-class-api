import mongoose from 'mongoose'

const teacherModel = new mongoose.Schema({
    name: { type: String, lowercase: true, required: true },
    subject:{ type: String, lowercase: true },
    phone:String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
})


export const Teacher = mongoose.model('Teacher', teacherModel)
