// eslint-disable-next-line import/no-extraneous-dependencies
import cors from 'cors'
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from 'cookie-parser'
import express from 'express'
import classRouter from './routes/classRoutes.js'
import teacherRouter from './routes/teacherRoutes.js'
import AppErrror from './utils/AppError.js'
import userRouter from './routes/authRoutes.js'
import optionRouter from './routes/optionRouts.js'
import accetRouter from './routes/accetsRouts.js'
import serviceRoutes from './routes/serviceRoutes.js'
import rateLimit from 'express-rate-limit'
import './logger.js'



const app = express()


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 2, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  
  app.use(limiter);
  

app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json())
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