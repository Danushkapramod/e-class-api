
import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import classRouter from './routes/classRoutes.js'
import teacherRouter from './routes/teacherRoutes.js'
import AppErrror from './utils/AppError.js'
import userRouter from './routes/authRoutes.js'
import optionRouter from './routes/optionRouts.js'
import accetRouter from './routes/accetsRouts.js'
import serviceRoutes from './routes/serviceRoutes.js'
import { authErrorLogger, combinedLogger } from './configs/logger.js'



const limiter = {
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
};

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
    
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {

            authErrorLogger.error({'Blocked by CORS**********************': origin}); // Logging the blocked origin
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
};


const app = express()

app.use(morgan('combined', { stream: combinedLogger.stream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(rateLimit(limiter));
app.use(cors(corsOptions));


app.use('/api/v1/classes', classRouter)
app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/users',  userRouter)
app.use('/api/v1/options', optionRouter)
app.use('/api/v1/awsSignedUrl', accetRouter)
app.use('/api/v1/sendMail', serviceRoutes)


app.all('*', (req, res, next) => {
    next(new AppErrror(`Can't find ${req.originalUrl} on this server!`, 404))
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    res.status(err.statusCode)
    res.json({
        status: err.status,
        message: err.message,
    })
})

export default app