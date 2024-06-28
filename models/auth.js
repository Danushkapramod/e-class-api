import validator from 'validator'
import bcrypt from 'bcryptjs'
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
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
})

authSchema.pre('save', async function (next) {
    //only run if password was actually modified
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

authSchema.pre('save', async function (next) {
    //only run if password was actually modified
    if (!this.isModified('password') || this.isNew) {
        return next()
    }
    this.passwordChangedAt = Date.now() - 1000
    next()
})

authSchema.pre('find', async function (next) {
    this.find({ active: { $ne: false } })
    next()
})

authSchema.methods.compairPassword = function (password, dbpassword) {
    return bcrypt.compare(password, dbpassword)
}

authSchema.methods.changePasswordAfter = function (JWTimestamp) {
    if (this.passwordChangedAt) {
        return this.passwordChangedAt.getTime() / 1000 > JWTimestamp
    }
    return false
}

authSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000
    // this.passwordResetToken = resetToken
    return resetToken
}

export const Auth = mongoose.model('Auth', authSchema)
