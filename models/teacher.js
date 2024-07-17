import mongoose from 'mongoose'

const teacherModel = new mongoose.Schema({
    name: { type: String, lowercase: true, required: true },
    subject: { type: String, lowercase: true },
    phone: String,
    avatar: String,
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    createdAt: { type: Date, default: Date.now },
})

export const Teacher = mongoose.model('Teacher', teacherModel)
