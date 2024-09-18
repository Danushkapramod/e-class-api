import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Auth } from '../models/tenants.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import {signInLogger } from '../configs/logger.js'
import { getTenantDB } from '../configs/database.js'
import { Email } from '../utils/Email.js'
import { Token } from '../models/refreshTokens.js'
import { S3BASE_URL } from '../configs/aws-config.js'
import { resizeImage, s3deleteFile, updateBuffer } from '../utils/ImageHandle.js'

dotenv.config()

const BASE_URL = 'http://localhost:5173';

export function createToken(user,type) {
   let expiresIn;
   let secret;

   if(type === 'access'){
     expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
     secret = process.env.JWT_ACCESS_SECRET
    }
   if(type === 'refresh'){
     expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
     secret = process.env.JWT_REFRESH_SECRET
    }
   const token =  jwt.sign(user, secret,{expiresIn} )
   return token  
}

export const getAllUsers = catchAsync(async function (req, res) {
    const users = await Auth.find()
    res.status(200).json({
        status: 'succes',
        body: { users },
    })
})

export const fetchAuthData = catchAsync(async function (req, res) {
    const auther = await Auth.findById(req.user._id)
    res.status(200).json({ token:req.token,auther })
})


export const updateAuther = catchAsync(async function (req, res, next) {
    const autherById = await Auth.findByIdAndUpdate(
        req.user._id,
        req.body,
        {new: true,
         runValidators: true,
        }
    )
    if (!autherById) {
        return next(new AppError('No auther found with that ID', 404))
    }
    res.status(200).json({status: 'succes'})
})

export const updateUserAvatar = catchAsync(async function (req, res, next) {
    if(req.file && req.file.buffer){
        const resizedBuffer = await resizeImage({buffer:req.file.buffer,height:512,width:512})
        const fileName = `assets/images/auth-avatars/user-${req.user._id}-${Date.now()}.webp`
        const result =  await updateBuffer({fileUrl:req.body.oldAvatar,fileName,buffer:resizedBuffer})
        if(result){
           const avatar = `${S3BASE_URL}${fileName}`
           req.body = {...req.body,avatar}
          }
     }else if(req.body.oldAvatar){
        const oldFileName = req.body.oldAvatar.split("amazonaws.com/")[1] 
        const result =  await s3deleteFile({fileName:oldFileName})
        if(result){
          req.body = {...req.body,avatar:''}  
        }
     }
    const autherById = await Auth.findByIdAndUpdate(req.user._id,req.body)
    if (!autherById) {
        return next(new AppError('No auther found with that ID', 404))
    }
    res.status(200).json({status: 'succes'})
})


export const signup = catchAsync(async function (req, res, next) {
    if (!req.body) return next(new AppError('Missing required fields', 404))

    const isTaken = await Auth.findOne({email: req.body?.email })
    if (isTaken) return next(new AppError('Email is already taken.', 400));

    const user = await Auth.create(req.body)
    const token = user.createEmailVerifyToken()
    await user.save();

    const url = `${BASE_URL}/verify-email?token=${token}`
    new Email({name:user.name,url,email:user.email}).verify()

    res.status(201).json({
        status: 'succes',
        body: {user},
    })
})

export const createAdmin = catchAsync(async function (req, res, next) {
    const isTaken = await Auth.findOne({loginId: req.body?.loginId})
    if (isTaken) return next(new AppError('Username is already taken.', 400));

    const user = await Auth.create({...req.body, rootUserId: req.tenantId});
    res.status(201).json({
        status: 'succes',
        body: {user},
    })
})

export const updateAdmin = catchAsync(async function (req, res, next) {
    const { id } = req.params;
    if (!id || !req.body) return next(new AppError('Missing required fields', 404));
    await Auth.findByIdAndUpdate(id, req.body);
    res.status(201).json('success')
})

export const verifyEmail = catchAsync(async function (req, res,next) {
    const token = req.query.token;
    if(!token) {
        return next(new AppError('No vefrify token!', 400))
    }
    const user = await Auth.findOne({
        emailVerifyToken:token, emailVerifyExpires:{$gt :Date.now()}
    })
    if(!user){ 
        return next(new AppError('Invalid or expired email verify token!', 401))
    }
    user.email_verified = true;
    user.emailVerifyToken = undefined;
    user.emailVerifyExpires = undefined;
    await user.save()

    getTenantDB(user._id)
    res.status(201).json({msg:'success'})
})


// export const login = catchAsync(async function (req, res, next) {
//     const { email, password } = req.body
//     if (!email || !password) {
//         return next(new AppError('Please provide email and password', 400))
//     }
//     const user = await Auth.findOne({ email,email_verified:true }).select('+password')
//     if (!user || !(await user.compairPassword(password, user.password))) {
//         return next(new AppError('Incorrect email or password', 401))
//     }
//     const access_token =  createToken({id:user._id},'access')
//     const refresh_token =  createToken({id:user._id},'refresh')

//     await Token.create({user_id:user._id,token:refresh_token})

//     const userResponse = { ...user._doc }; 
//     delete userResponse.password; 

//     const cokiesOptio = {
//         expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
//         httpOnly:true,
//         secure:true,
//         sameSite: 'None',
//     }
//     res.cookie('access_token', access_token, cokiesOptio);
//     res.cookie('refresh_token', refresh_token, cokiesOptio);

//     res.status(200).json({user:userResponse})  
//     signInLogger.info({user:user.email, message:'Sign-in successful'})
// })



export const login = catchAsync(async function (req, res, next) {
    const { email, password, username, loginType } = req.body
    let user;
    if(loginType === 'rootAdmin'){
       if (!email || !password) {
         return next(new AppError('Please provide email and password', 400))
       }
         user = await Auth.findOne({ email,email_verified:true }).select('+password')
       if (!user || !(await user.compairPassword(password, user.password))) {
         return next(new AppError('Incorrect email or password', 401))
       }
    }else if(loginType === 'subAdmin') {
        if (!username || !password) {
            return next(new AppError('Please provide Username and password', 400))
        }
         user = await Auth.findOne({ loginId: username }).select('+password')
        if (!user || !(await user.compairPassword(password, user.password))) {
          return next(new AppError('Incorrect Username or password', 401))
        }
    }
    const access_token =  createToken({id:user._id},'access')
    const refresh_token =  createToken({id:user._id},'refresh')

    await Token.create({user_id:user._id,token:refresh_token})

    const userResponse = { ...user._doc }; 
    delete userResponse.password; 

    const cokiesOptio = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite: 'None',
    }
    res.cookie('access_token', access_token, cokiesOptio);
    res.cookie('refresh_token', refresh_token, cokiesOptio);

    res.status(200).json({user:userResponse})  
    signInLogger.info({user:user.email, message:'Sign-in successful'})
})

  
export const logOut = catchAsync(async function (req, res) {
    await Token.findOneAndDelete({token:req.cookies.refresh_token})
    res.clearCookie('access_token', { httpOnly: true })
    res.clearCookie('refresh_token', { httpOnly: true })
    res.status(200).json();
})


export const protect = catchAsync(async function (req, res, next) {
    const token = req.cookies.access_token || 
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if(!token){
        return next(new AppError("Unauthorized: Authentication token is missing.", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET ,(err,user)=> user || false)

    if(!decoded){
        const refresh_token = req.cookies.refresh_token
        if(!refresh_token){ 
            return next(new AppError("Refresh token is missing.", 401)); 
        }
        const isValidToken = await Token.findOne({token: refresh_token});
        if(!isValidToken){ 
            return next(new AppError("Invalid refresh token.", 401)); 
        }
        const decode = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err,user)=>  user || false);
        if(!decode){
             return next(new AppError("Invalid refresh token.", 401));
        }
        const access_token = createToken({id: decode.id},'access')
        
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        }
        res.cookie('access_token', access_token, cookieOptions)
           .status(200).json()
           return 
    }

    const freshUser = await Auth.findById(decoded.id)
    if (!freshUser) {
        return next(
            new AppError('The user belonging to this token does no longer exist!.', 400)
        )
    }
    if (freshUser.changePasswordAfter(decoded.iat)) {
        return next(
            new AppError('User recently changed password! Please log in again.', 400)
        )
    }
    req.user = freshUser
    if(freshUser.role === 'subAdmin') req.tenantId = freshUser.rootUserId
    else if(freshUser.role === 'rootAdmin') req.tenantId = freshUser._id
    console.log(freshUser.role);
    
    next()
})




export const changePassword = catchAsync(async function (req, res, next) {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new AppError("Current password and new password are required.", 400));
    }
    const user = await Auth.findById(req.user._id).select('+password');

    if (!user || !(await user.compairPassword(currentPassword, user.password))) {
        return next(new AppError('Invalid current password.', 401));
    }
    user.password = newPassword;
    await user.save();

    const access_token =  createToken({id:user._id},'access')
    const refresh_token =  createToken({id:user._id},'refresh')

    const cokiesOptio = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite: 'None',
    }
    res.cookie('access_token', access_token, cokiesOptio);
    res.cookie('refresh_token', refresh_token, cokiesOptio);
    res.status(200).json({ message: 'Password changed successfully.' });
});


  export const forgotPassword = catchAsync(async function (req, res, next) {
   
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required.", 400));
    }
    const user = await Auth.findOne({ email });
    if (!user) {
        return next(new AppError('User not found.', 401));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save();

    const url = `${BASE_URL}/reset-password?token=${resetToken}&email=${email}`;
    new Email({name:user.name,url,email:user.email}).passwordResetToken()

    res.status(200).json('Password reset email sent.');
});




export const resetPassword = catchAsync(async function (req, res, next) {
    const { email, token, new_password } = req.body;

    if (!email || !token || !new_password) {
        return next(new AppError("Email, token, and new password are required.", 400));
    }
    const user = await Auth.findOne({ email });

    if (!user) {
        return next(new AppError('User not found.', 401));
    }
    if (!user.compaireResetToken(token)) {
        return next(new AppError('Invalid or expired token.', 401));
    }

    user.password = new_password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    
    res.clearCookie('access_token', { httpOnly: true });
    res.status(200).json('Password reset successfully.');
});



export const emailChangePin = catchAsync(async function (req, res, next) {
    const new_email = req.body.new_email;
    const email = req.user.email;

    if (!new_email || !email) {
        return next(new AppError("Current email and new email are required.", 400));
    }
    const user = await Auth.findOne({ email });

    if (!user) {
        return next(new AppError('User not found.', 401));
    }
    const resetPin = user.createEmailResetPin();
    user.pendingEmail = new_email
    await user.save();

    new Email({name:user.name,pin:resetPin,email:new_email}).emailChangePin()
    
    res.status(200).json('Email change pin sent.');
});



export const changeEmail = catchAsync(async function (req, res, next) {
    const  pin  = req.body.pin;
    const email = req.user.email;

    if ( !pin || !email) {
        return next(new AppError("Current email, new email, and pin are required.", 400));
    }

    const user = await Auth.findOne({ email });
    if (!user) {
        return next(new AppError('User not found.', 401));
    }
    const isAlsoUser = await Auth.findOne({ email: user.pendingEmail });
    if (isAlsoUser) {
        user.pendingEmail = undefined;
        user.emailResetExpires = undefined;
        user.emailResetPin = undefined;
        user.email_verified = undefined;
        user.save()
        return next(new AppError('New email is already in use.', 401));
    }

    if (!user.compairePin(pin)) {
        return next(new AppError('Invalid or expired email change pin.', 401));
    }
    user.applyPendingEmailChange()
    await user.save();

    const access_token =  createToken({id:user._id},'access')
    const refresh_token =  createToken({id:user._id},'refresh')

    const cokiesOptio = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure:true,
        sameSite: 'None',
    }
    res.cookie('access_token', access_token, cokiesOptio);
    res.cookie('refresh_token', refresh_token, cokiesOptio);

    res.status(200).json('Email changed successfully.' );
});

export const getAdmins = catchAsync(async function (req, res) {
    const users = await Auth.find({ rootUserId: req.user._id, iisVisible:true });
    res.status(201).json(users)
})

export const hideAdmin = catchAsync(async function (req, res, next) {
    const {data,idList} = req.body
    if(!data || !idList) return next()
    await Auth.updateMany({_id:{$in:idList}},data)
    res.status(200).json('success')
})

export const getHiddenAdmins = catchAsync(async function (req, res) {
    const admins = await Auth.find({isVisible: false, rootUserId: req.user._id})
    res.status(200).json(admins)
})

export const deleteAdmin = catchAsync(async function (req, res,  next) {
    const { id } = req.params;
    if (!id) return next(new AppError('Missing required fields', 404));
    await Auth.findByIdAndDelete(id)
    res.status(200).json('success')
})

export const deleteManyAdmins = catchAsync(async function (req, res,next) {
    const {idList} = req.body
    if (!idList) {
        return next(new AppError('No Student found', 404))
    }
    await Auth.deleteMany({_id:{$in:idList}})
    res.status(200).json('succes')
})


