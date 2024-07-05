import validator from 'validator'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import mongoose from 'mongoose'

const authSchema = new mongoose.Schema({
    name: {
        required: [true, 'Name is required!'],
        type: String,
        maxlength: [255, 'Maximun letter reached out!'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: [255, 'Maximun letter reached out!'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    phone:String,
    avatar: String,
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },

    password: {
        type: String,
         required: [true, 'Password is required!'],
         minlength: [6, 'Password need 6 characters minimum!'],
        select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailResetPin:String,
    pendingEmail:  {
        type: String,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    emailResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

authSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

authSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next()
    this.passwordChangedAt = Date.now() - 1000
    next()
})

authSchema.pre('find', async function (next) {
    this.find({ active: { $ne: false } })
    next()
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

export const Auth = mongoose.model('Auth', authSchema)
