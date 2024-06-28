import express from 'express'
import classRouter from './routes/classRoutes.js'
import teacherRouter from "./routes/teacherRoutes.js"
import AppErrror from './utils/AppError.js'
import userRouter from './routes/authRoutes.js'

export const app = express()
app.use(express.json())
app.use('/api/v1/classes', classRouter)
app.use('/api/v1/teachers', teacherRouter)
app.use('/api/v1/users', userRouter)

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
