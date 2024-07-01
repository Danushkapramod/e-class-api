import jwt from 'jsonwebtoken'
import { Auth } from '../models/auth.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'


function createToken(user) {
    user.password = undefined
    const payload = { _id: user._id,email: user.email,}
    const options = {expiresIn: process.env.JWTEXPIRES_IN}

    const token =  jwt.sign(payload, process.env.JWT_SECRET,options )
    return token  
}

export const getAllUsers = catchAsync(async function (req, res, next) {
    const users = await Auth.find()
    res.status(200).json({
        status: 'succes',
        body: { users },
    })
})

export const fetchAuthData = catchAsync(async function (req, res, next) {
    const auther = await Auth.findById(req.user._id)
    res.status(200).json({ token:req.token,auther })
})

export const signup = catchAsync(async function (req, res) {
    const user = await Auth.create({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.photo,
        password: req.body.password,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    })

    res.status(201).json({
        status: 'succes',
        body: { user },
    })
})

export const login = catchAsync(async function (req, res, next) {
    const { email, password } = req.body

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    const user = await Auth.findOne({ email }).select('+password')
    if (!user || !(await user.compairPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
    const token =  createToken(user)

    res.cookie('access_token', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure: false,
         
    });
    res.status(200).json({
        token,
        user,
    })
})

export const protect = catchAsync(async function (req, res, next) {

    let bearerToken = null
    const bearerHeader = req.headers.authorization

    if (bearerHeader) {
        bearerToken = bearerHeader.split(' ')[1]
    }
    const cookieToken = req.cookies.access_token
    const token =  cookieToken || bearerToken

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const freshUser = await Auth.findById(decoded._id)
    if (!freshUser) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist!.',
                201
            )
        )
    }
    if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User resently changed password! Please log in again',
                400
            )
        )
    }
    req.user = freshUser
    req.token = token
    next()
})
