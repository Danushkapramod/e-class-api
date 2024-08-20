import mongoose from 'mongoose'

 export const attendancesShema = new mongoose.Schema({
    classId:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true
    },
    studentId:{
        type:mongoose.SchemaTypes.ObjectId,
        require:true
    },
    date: {
        type: Date,
        default:Date.now
      },
    isPresent: {
        type: Boolean,
        required: true,
        default:false
    }
})


