import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config()



const uri = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
const connect =  mongoose
    .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected successfully')
      
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
        process.exit(1) 
    })


    export const connectToMongoDB = () => {
        const db = connect(process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD));
        db.on('open', () => {
         // log.info(`Mongoose connection open to ${JSON.stringify(process.env.MONGODB_URL)}`);
        });
        db.on('error', (err) => {
          //log.info(`Mongoose connection error: ${err} with connection info ${JSON.stringify(process.env.MONGODB_URL)}`);
          process.exit(0);
        });
        return db;
      };


export default connect