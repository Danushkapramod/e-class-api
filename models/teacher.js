import mongoose from 'mongoose'

export const teacherShema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: true },
    subject: { type: String, lowercase: true },
    phone: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
})

