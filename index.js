
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
import { combinedLogger } from './configs/logger.js'

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
});

const corss = cors({
        origin: 'http://localhost:5173', 
        methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    })
const app = express()

app.use(morgan('combined', { stream: combinedLogger.stream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(limiter);
app.use(corss);


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