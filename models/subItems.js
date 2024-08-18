import mongoose from 'mongoose'

 export const subItemsShema = new mongoose.Schema({
    itemName: { type: String, isLowercase: true,required: true },
    category: String,
    isVisible:{type:Boolean,default:true},
})


