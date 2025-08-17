
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
import subItemRouter from './routes/subItemRout.js'
import serviceRoutes from './routes/serviceRoutes.js'
import studentRoutes from './routes/studentRouts.js'
import assetRoutes from './routes/accetsRoutes.js'
import {  combinedLogger } from './configs/logger.js'

const limiter = {
    windowMs: 15 * 60 * 1000, 
    max: 30000, 
    message: 'Too many requests from this IP, please try again later.'
};

const corsOptions = {
    origin:['http://localhost:5173','https://www.edusuit.online'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
};

const app = express()

app.use(morgan('short', { stream: combinedLogger.stream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(rateLimit(limiter));
app.use(cors(corsOptions));


app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
      Object.entries(req.body).forEach(([key, value]) => {
        if (typeof value === 'string') {
          req.body[key] = value.trim();
        }
      });
    }
    next();
  });

app.use('/api/v1/classes', classRouter)
app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/users',  userRouter)
app.use('/api/v1/options', optionRouter)
app.use('/api/v1/subItems', subItemRouter)
app.use('/api/v1/services', serviceRoutes)
app.use('/api/v1/assets',assetRoutes)
app.use('/api/v1/students',studentRoutes)

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