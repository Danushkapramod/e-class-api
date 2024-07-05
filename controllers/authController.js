import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { Auth } from '../models/auth.js'
import catchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import { sendMail } from '../services/emailConfig.js'

dotenv.config({ path: './config.env' })



function sendPasswordResetToken({token,name,email}){
    const resetUrl = `http://localhost:5173/reset-password?token=${token}&email=${email}`;
    const message = `${name} you requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'Password Reset Token',
      text: message,
      html: `<p> ${name} you requested a password reset. Please click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    sendMail(mailOptions)
}

function sendEmailChangePin({ pin, name, email }) {
    const message = `${name}, you requested to change your email address. Your verification PIN is: ${pin}`;
  
    const mailOptions = {
      from: 'no-reply@yourdomain.com',
      to: email,
      subject: 'Email Change Verification PIN',
      text: message,
      html: `<p>${name}, you requested to change your email address.</p><p>Your verification PIN is: <strong style="font-size: 24px;">${pin}</strong></p>`,
    };
  
    sendMail(mailOptions);
  }
  
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



export const updateAuther = catchAsync(async function (req, res, next) {
    const autherById = await Auth.findByIdAndUpdate(
        req.user._id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    )
    if (!autherById) {
        return next(new AppError('No auther found with that ID', 404))
    }
    res.status(200).json({status: 'succes'})
})


export const signup = catchAsync(async function (req, res) {
    const user = await Auth.create({
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.photo,
        password: req.body.password,
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
        secure: true,   
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

    const token =  createToken(user)
    res.cookie('access_token', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly:true,
        secure: true,   
    });
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

    sendPasswordResetToken({
        token: resetToken,
        email: user.email,
        name: user.name
    });

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
    await user.save();

    sendEmailChangePin({
        pin: resetPin,
        email: new_email,
        name: user.name
    });
    res.status(200).json('Email change pin sent.');
});



export const changeEmail = catchAsync(async function (req, res, next) {
    const { new_email, pin } = req.body;
    const email = req.user.email;

    if (!new_email || !pin || !email) {
        return next(new AppError("Current email, new email, and pin are required.", 400));
    }

    const user = await Auth.findOne({ email });
    if (!user) {
        return next(new AppError('User not found.', 401));
    }

    const isAlsoUser = await Auth.findOne({ email: new_email });
    if (isAlsoUser) {
        return next(new AppError('New email is already in use.', 401));
    }

    if (!user.compairePin(pin)) {
        return next(new AppError('Invalid or expired email change pin.', 401));
    }

    user.email = new_email;
    user.emailResetPin = undefined;
    user.emailResetExpires = undefined;
    await user.save();

    const token = createToken(user);
    res.cookie('access_token', token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
    });

    res.status(200).json('Email changed successfully.' );
});






