import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import express from 'express';
import  app  from './index.js'
import './DbConnection.js';
import './logger.js'


dotenv.config({ path: './config.env' })

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.'
});
const corss = cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })  

app.use(helmet)
app.use(limiter);
app.use(corss);
app.use(express.json())
app.use(cookieParser())

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('Server running on port ' + port)
})
