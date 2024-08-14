import mongoose from 'mongoose'

export const teacherShema = new mongoose.Schema({
    name: { type: String, lowercase: true, required: true },
    subject: { type: String, lowercase: true },
    phone: String,
    avatar: String,
    isVisible:{type:Boolean,default:true},
    createdAt: { type: Date, default: Date.now },
    hiddenAt: { type: Date },
})

teacherShema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (Object.prototype.hasOwnProperty.call(update, 'isVisible')){
    update.hiddenAt = Date.now()
    this.setUpdate(update);
    }
    next(); 
  })