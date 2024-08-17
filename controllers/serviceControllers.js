
import axios from "axios";
import { DriveTokens } from "../models/drive_tokens.js";
import AppErrror from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js"


export const driveOauthSignup = catchAsync(async function (req, res,next) {
    if(!req.body.code)return next()
    const postData = {
        code: req.body.code,
        client_id: '89181791749-i81vabbfv9pk58u2o25l5itu7jpke2j2.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:5173/app/backups',
        grant_type: 'authorization_code'
    }
    const response = await axios.post('https://oauth2.googleapis.com/token', postData);
    if(!response.data.access_token)return next(new AppErrror('?',400))
        const tokens = await  DriveTokens.findOneAndUpdate({userId:req.tenantId},{
            userId:req.tenantId,
            accessToken:response.data.access_token,
            refreshToken:response.data.refresh_token
        },
        {upsert:true,
        new:true   }
    )   
    res.status(200).json(tokens)
})

