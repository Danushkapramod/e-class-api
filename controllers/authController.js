import jwt from 'jsonwebtoken'
import { Auth } from '../models/auth.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

function genarateJWT(data) {
    return jwt.sign(data, process.env.JWT_SECRET,process.env.JWTEXPIRES_IN)
}

function createSendToken(user,res){
    user.password = undefined
    const payload = {
        userId: user._id,
        name: user.name,
        email: user.email,
        roles: user.role,
        avatar: user.avatar,
        scopes: user.scope
      };
    const token = genarateJWT(payload)

    res.cookie('jwt',token,{
        expires:new Date(Date.now() + 3600 * 1000),
        // secure:true,
        httpOnly:true
     })
     res.status(200).json({
        token,
        user
    })  
    
}


export const getAllUsers = catchAsync(async function (req, res, next) {

    const users = await Auth.find()
    res.status(200).json({
        status: 'succes',
        body: { users },
    })
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
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }
    const user = await Auth.findOne({ email }).select('+password')
    if (!user || !(await user.compairPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401))
    }
   // res.status(200).json(token)
   createSendToken(user,res)
})

export const protect = catchAsync(async function (req, res, next) {
    const token = req.headers.authorization
    if (!token) {
        return next(new AppError('Access denied. No token provided.', 401))
    }
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
    const freshUser = await Auth.findOne({ _id: decoded.id })
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
    next()
})
