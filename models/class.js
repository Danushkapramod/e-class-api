import mongoose, { Schema } from 'mongoose'

export const classSchema = new mongoose.Schema({
    subject: { type: String, lowercase: true, required: true },
    grade: { type: String, lowercase: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
    hall: { type: String, lowercase: true },
    day: { type: String, lowercase: true },
    tenant_id: {type: mongoose.Schema.Types.ObjectId,required: true},
    startTime: String,
    duration: String,
    charging: Number,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
})

classSchema.pre('find', function() {
     if (this.tenant_id) {
            this.where({ tenant_id: this.tenant_id });
        }
});
export const Class = mongoose.model('Class', classSchema)
