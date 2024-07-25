import mongoose from "mongoose";
import { mongodb } from "../configs/database.js";

export const tokenShema = new mongoose.Schema({
    user_id:String,
    token:String,
    expires_at:Date,
    updated_at:Date,
    created_at:{
        type:Date,
        default:Date.now
    }
})

tokenShema.pre('save',function(next){
    this.expires_at = Date.now() + 30 * 24 * 60 * 60 * 1000
    next()
})

tokenShema.pre('save',function(next){
    if(!this.isModified('token') || this.isNew) return next()
    this.expires_at = Date.now() + 30 * 24 * 60 * 60 * 1000
    next()
})

export const Token = mongodb.model('Token',tokenShema)