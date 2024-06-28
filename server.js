import dotenv from 'dotenv'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { app } from './index.js'

dotenv.config({ path: './config.env' })

const uri = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
)

mongoose
    .connect(uri)
    .then(() => {
        console.log('MongoDB connected successfully')
        // You can start your server or perform other actions here
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
        process.exit(1) // Exit process with failure
    })

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log('Server running on port ' + port)
})
