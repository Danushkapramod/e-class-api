import mongoose, { Schema } from 'mongoose'

export const classSchema = new mongoose.Schema({
    subject: { type: String, lowercase: true, required: true },
    grade: { type: String, lowercase: true },
    teacher: { type: Schema.Types.ObjectId, ref: 'Teacher', default: null },
    hall: { type: String, lowercase: true },
    day: { type: String, lowercase: true },
    startTime: String,
    duration: String,
    charging: Number,
    avatar: String,
    isVisible:{type:Boolean,default:true},
    createdAt: { type: Date, default: Date.now },
    hiddenAt: { type: Date },
})


classSchema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (Object.prototype.hasOwnProperty.call(update, 'isVisible')){
    update.hiddenAt = Date.now()
    this.setUpdate(update);
    }
    next(); 
  })