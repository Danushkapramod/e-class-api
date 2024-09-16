import validator from 'validator'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mongoose, { Schema } from 'mongoose'
import {  mongodb } from '../configs/database.js'


const authSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 255,
    },
    email: {
        type: String,
        maxlength: 255,
        lowercase: true,
        validate: validator.isEmail,
    },
    loginId: {
        type: String,
        unique: true
    },
    phone:String,
    avatar: String,
    rootUserId: {
        type: Schema.Types.ObjectId,
        unique: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['rootAdmin', 'subAdmin'],
        default: 'rootAdmin',
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false,
    },
    email_verified:{
        type:Boolean,
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    pendingEmail:  {
        type: String,
        lowercase: true,
        validate: validator.isEmail
    },
    metaData:{
        instituteName:String,
        address:String,
        city:String
    },
    isVisible:{type:Boolean,default:true},
    permissions: [String],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailResetPin:String,
    emailResetExpires: Date,
    emailVerifyToken: String,
    emailVerifyExpires: Date,
    refreshToken: String,    
    hiddenAt: { type: Date },  
})

authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

authSchema.pre('save',function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

authSchema.pre(['find', 'findOne','findById'], function (next) {
    this.where({ active: { $ne: false }})
    next()
})

authSchema.pre(['updateMany','findOneAndUpdate'], async function (next) {
    const update = this.getUpdate();
    if (Object.prototype.hasOwnProperty.call(update, 'isVisible')){
       update.hiddenAt = Date.now()
       this.setUpdate(update);
    }
    next(); 
})

authSchema.methods.applyPendingEmailChange = function () {
    if(!this.pendingEmail  || !this.email) return false
    this.email = this.pendingEmail
    this.pendingEmail = undefined
    this.emailResetExpires = undefined
    this.emailResetPin = undefined
    return true
}

authSchema.methods.compairPassword = function (password, dbpassword) {
    return bcrypt.compare(password, dbpassword)
}

authSchema.methods.changePasswordAfter = function (JWTimestamp) {
    if (this.passwordChangedAt) {
        return this.passwordChangedAt.getTime() / 1000 > JWTimestamp
    }
    return false
}
authSchema.methods.compaireResetToken = function (token) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const isTokenValid = hashedToken === this.passwordResetToken  
    const isTokenValidPeriod = this.passwordResetExpires && this.passwordResetExpires > Date.now();
    return isTokenValid && isTokenValidPeriod
}


authSchema.methods.compairePin = function (pin) {
    const hashedPin = crypto.createHash('sha256').update(pin.trim()).digest('hex')
    const isPinValid = hashedPin === this.emailResetPin
    const isPinValidPeriod = this.emailResetExpires && this.emailResetExpires > Date.now();
    return isPinValid && isPinValidPeriod
}

authSchema.methods.createEmailVerifyToken = function () {
    const token = crypto.randomBytes(32).toString('hex')
    this.email_verified = false;   
    this.emailVerifyToken = token;
    this.emailVerifyExpires = Date.now() + 24 * 60 * 60 * 1000
    return token
}

authSchema.methods.createEmailResetPin = function () {
    const resetPin = crypto.randomInt(0, 1000000).toString().padStart(6, '0');
    this.emailResetPin = crypto.createHash('sha256').update(resetPin).digest('hex')
    this.emailResetExpires = Date.now() + 10 * 60 * 1000
    return resetPin
}

authSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    return resetToken
}


export const Auth = mongodb.model('Tenant', authSchema)
