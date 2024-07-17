import mongoose from 'mongoose'

const hallModel = new mongoose.Schema({
    hallName: { type: String, required: true },
    tenant_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export const Hall = mongoose.model('Hall', hallModel)
