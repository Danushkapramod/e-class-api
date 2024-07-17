import mongoose from 'mongoose'

const gradeModel = new mongoose.Schema({
    gradeName: { type: String, isLowercase: true, required: true },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export const Grade = mongoose.model('Grade', gradeModel)
