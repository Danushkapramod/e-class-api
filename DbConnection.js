
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: './config.env' })

const uri = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
export default mongoose
    .connect(uri)
    .then(() => {
        console.log('MongoDB connected successfully')
      
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
        process.exit(1) 
    })
