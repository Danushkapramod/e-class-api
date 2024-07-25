import mongoose from 'mongoose'
import { mongodb } from '../configs/database.js'
import { generate10DigitID } from '../utils/random.Genarates.js';

 export const studentShema = new mongoose.Schema({
    studentId:{type:String,unique:true},
    name: { type: String, isLowercase: true},
    phone:String
  
})
studentShema.pre('save',function(next){
    if(!this.isNew) return next()
    this.studentId = generate10DigitID()
    next()
})


export const Student = mongodb.model('Student',studentShema)