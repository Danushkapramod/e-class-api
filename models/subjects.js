import mongoose from 'mongoose'

const subjectModel = new mongoose.Schema({
    subjectName: { type: String, isLowercase: true, required: true },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export const Subject = mongoose.model('Subject', subjectModel)
