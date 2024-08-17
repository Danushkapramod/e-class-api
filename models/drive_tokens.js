import mongoose from 'mongoose'
import { mongodb } from '../configs/database.js'

 export const driveTokensShema = new mongoose.Schema({
    userId:mongoose.SchemaTypes.ObjectId,
    accessToken: String,
    refreshToken:String
    
})

export const DriveTokens = mongodb.model('Drive_token',driveTokensShema)
