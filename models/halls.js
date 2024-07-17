import mongoose from 'mongoose'

 export const hallShema = new mongoose.Schema({
    hallName: { type: String, required: true }
})


