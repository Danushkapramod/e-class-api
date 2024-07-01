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

export const app = express()

app.use(cookieParser())
app.use(cors({
    origin: 'http://13.49.145.14', 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
app.use(express.json())
app.use('/api/v1/classes', classRouter)
app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/options', optionRouter)
app.use('/api/v1/test', (req, res, next) => {
    res.status(200).json({
        query: req.query,
    })
})

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
