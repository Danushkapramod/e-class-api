import mongoose from 'mongoose'

 export const subjectShema = new mongoose.Schema({
    subjectName: { type: String, isLowercase: true, required: true },
    
})

