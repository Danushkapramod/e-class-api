import mongoose from 'mongoose'

const classModel = new mongoose.Schema({
    subject: { type: String, lowercase: true, required: true },
    grade: { type: String, lowercase: true },
    teacherId: String,
    hall:{ type: String, lowercase: true },
    day: { type: String, lowercase: true},
    startTime: String,
    duration: String,
    charging: Number,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
})


export const Class = mongoose.model('Class', classModel)
